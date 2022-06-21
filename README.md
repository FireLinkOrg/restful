<div align="center">

  # @firelink/restful

</div>


# Features
- Written in TypeScript
- Support ESM & CommonJS

# Example 

```ts
import { REST } from "@firelink/restful";

(async () => {
    const lavalinkRest = new REST("http://lava.link:80")
    .setAuthorization("youshallnotpass")

    const tracks = await lavalinkRest.loadTracks("never gonna give you up");
    console.log(tracks);
})()
```