import { CyberflySDK } from "@cyberfly-io/client";

async function geo_example(){
    const sdk = new CyberflySDK('https://node.cyberfly.io');
    const dbaddr = "/orbitdb/zdpuAyBgp2MYritN8ebpmsaXk2sF4oYgYNrqRzMSRWN7BpfVL"
    const locationLabel = "mylands"
    const radius = 1000000
    const member = "abu house"
    const lon = 1.5
    const lat = 1.5
    const unit = 'km'
    const result_by_coords = await sdk.geoSearch(dbaddr,locationLabel,
        lon,lat, radius, unit
    )
    const result_by_member = await sdk.geoSearchWith(dbaddr,locationLabel,
         member,radius, unit
    )
    const distance = await sdk.getDistance(dbaddr, locationLabel, member, "abu house2", "km")
    const position = await sdk.getPosition(dbaddr, locationLabel, member)
    const hash = await sdk.getGeoHash(dbaddr, locationLabel, member)


    console.log(result_by_coords)
    console.log(result_by_member)
    console.log(distance)
    console.log(position)
    console.log(hash)
}

await geo_example()