import { provinsi, kabkot, kecamatan } from 'nik-parser/src/wilayah.json'
import { writeFile } from 'fs/promises'
let provinces: any = []
let cities: any = []
let districts: any = []
Object.keys(provinsi).map(p => {
    let province = {
        id: Number(p),
        name: provinsi[p]
    }
    provinces.push(province)

})
Object.keys(kabkot).map(k => {
    let city = {
        id: Number(k.substr(2, 4)),
        province_id: Number(k.substr(0, 2)),
        name: kabkot[k]
    }
    cities.push(city)
})

Object.keys(kecamatan).map(k => {
    let district = {
        id: Number(k.substr(4, 6)),
        province_id: Number(k.substr(0, 2)),
        city_id: Number(k.substr(2, 4)),
        postal_code: Number(kecamatan[k].slice(-5)),
        name: kecamatan[k].split('--')[0].trim()
    }
    districts.push(district)
})
let data = {provinces, cities, districts
}
writeFile('./src/assets/location.json', JSON.stringify(data))