import {provinsi,kabkot,kecamatan} from 'nik-parser/src/wilayah.json'
import {writeFile} from 'fs/promises'
import {ProvinsiContract, KotaContract, KecamatanContract} from './src/address'
let provinces: ProvinsiContract[] = []
let kota: KotaContract[] = []
let district: KecamatanContract[] = []
Object.keys(provinsi).map(p => {
    let pro: ProvinsiContract = {
        id: Number(p),
        name: provinsi[p]
    }
    provinces.push(pro)
    
})
Object.keys(kabkot).map(k => {
    let kot: KotaContract = {
        id: Number(k.substr(0, 4)),
        provinsi_id: Number(k.substr(0, 2)),
        name: kabkot[k]
    }
    kota.push(kot)
})

Object.keys(kecamatan).map(k => {
    let kec: KecamatanContract = {
        id: Number(k),
        provinsi_id: Number(k.substr(0, 2)),
        kota_id: Number(k.substr(0, 4)),
        postal_code: Number(kecamatan[k].slice(-5)),
        name: kecamatan[k].split('--')[0]
    }
    district.push(kec)
})
let data  = {
    provinsi: provinces,
    kota,
    kecamatan: district
}
writeFile('./wilayah.json', JSON.stringify(data))