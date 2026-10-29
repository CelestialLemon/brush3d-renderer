# Reference

The target look is *Dear Alice* (The Line for Chobani, 2021): https://www.youtube.com/watch?v=z-Ng5ZvrDm4

Stills from it are copyrighted, so they stay out of git. To get them locally (yt-dlp and ffmpeg):

```sh
yt-dlp -f "bv*[height<=1080][ext=mp4]" -o /tmp/alice.mp4 "https://www.youtube.com/watch?v=z-Ng5ZvrDm4"
for p in 3:moss-and-flowers 6:solar-panels-meadow 15:farmhouse-valley 18:orchard-tree-greenhouse 24:valley-fields-city \
         30:wheat-field-poles 37:aerial-farm 48:dome-and-grass 60:sunset-valley; do
  ffmpeg -loglevel error -y -ss ${p%%:*} -i /tmp/alice.mp4 -frames:v 1 -q:v 2 reference/alice-${p#*:}.jpg
done
```

`alice-aerial-farm.jpg` (0:37) is the main target: almost exactly the game's camera.
