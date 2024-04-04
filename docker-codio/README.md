Codio
-----

Build image
```docker build -t codio/drawio --file ./docker-codio/Dockerfile .```

Start
```docker run -it --rm --name="draw" -p 80:80 codio/drawio```