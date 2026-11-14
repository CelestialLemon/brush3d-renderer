# Builds the models (tools/blender/models/) into .glb files and writes their index. See docs/MODELS.md.
#   flatpak run org.blender.Blender -b --factory-startup --python $PWD/tools/blender/build.py -- $PWD/src/scenes/models [name ...]
# With no names, every model. Each is a deterministic generator: `build(m)` draws into a kit.Model.
import importlib
import json
import sys
from pathlib import Path
import bpy
from mathutils import Vector

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import kit  # noqa: E402

ARGS = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
OUT = Path(ARGS[0] if ARGS else '.')
# Triangles a model may have unless it sets its own BUDGET (the whole farm draws them all: docs/PERFORMANCE.md).
BUDGET = 6000


def names():
    return sorted(p.stem for p in (HERE / 'models').glob('*.py') if not p.stem.startswith('_'))


def export(name):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    mod = importlib.import_module(f'models.{name}')
    m = kit.Model(name)
    mod.build(m)
    objs = m.finish()
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.context.view_layer.update()
    tris, lo, hi, parts = 0, Vector((1e9,) * 3), Vector((-1e9,) * 3), []
    tiles = mod.TILES
    # Parts that may leave the footprint (a rotor sweeping over the neighbours, a wheel in the river).
    free = getattr(mod, 'FREE', ())
    limit = [tiles[0] * kit.TILE / 2 + 0.005, tiles[1] * kit.TILE / 2 + 0.005]
    for o in objs:
        if o.type != 'MESH':
            parts.append(o.name)
            continue
        if o.name != name:
            parts.append(o.name)
        o.data.calc_loop_triangles()
        tris += len(o.data.loop_triangles)
        for v in o.data.vertices:
            p = o.matrix_world @ v.co
            # Blender's (x, y, z) is the model's (x, -z, y).
            q = Vector((p.x, p.z, -p.y))
            lo, hi = Vector(map(min, lo, q)), Vector(map(max, hi, q))
            if o.name not in free:
                assert abs(q.x) <= limit[0] and abs(q.z) <= limit[1], f'{name}: {o.name} leaves its {tiles[0]}x{tiles[1]} footprint at {tuple(round(c, 2) for c in q)}'
                assert q.y > -0.02, f'{name}: {o.name} goes below the ground at {tuple(round(c, 2) for c in q)}'
    budget = getattr(mod, 'BUDGET', BUDGET)
    assert tris <= budget, f'{name}: {tris} triangles, over its budget of {budget}'
    OUT.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(OUT / f'{name}.glb'), export_format='GLB', use_selection=True, export_yup=True, export_apply=False,
        export_normals=True, export_texcoords=True, export_materials='EXPORT', export_vertex_color='NONE',
        export_all_vertex_colors=False, export_attributes=True, export_tangents=False, export_animations=False, export_extras=True,
    )
    print(f'  {name}: {tris} triangles, {hi.x - lo.x:.1f} x {hi.y:.1f} x {hi.z - lo.z:.1f} m')
    return dict(title=mod.TITLE, group=mod.GROUP, about=mod.ABOUT, tiles=list(tiles), triangles=tris,
                lo=[round(c, 2) for c in lo], hi=[round(c, 2) for c in hi], parts=sorted(parts))


def main():
    picked = ARGS[1:] or names()
    index_path = OUT / 'index.json'
    index = json.loads(index_path.read_text()) if index_path.exists() else {}
    for name in picked:
        index[name] = export(name)
    index = {k: index[k] for k in sorted(index) if k in names()}
    index_path.write_text(json.dumps(index, indent=1) + '\n')
    print(f'{len(picked)} built; {len(index)} models, {sum(v["triangles"] for v in index.values())} triangles in all')


if __name__ == '__main__':
    main()
