import { provinsi, kota, kecamatan } from './assets/wilayah.json'

export type ProvinsiContract = {
    id: number
    name: String
}
export type KotaContract = {
    id: number
    provinsi_id: ProvinsiContract['id']
    name: String
}
export type KecamatanContract = {
    id: number,
    provinsi_id: ProvinsiContract['id']
    kota_id: KotaContract['id'],
    postal_code: number | null,
    name: String
}

export type AddressContract = {
    provinsi: ProvinsiContract[],
    kota: KotaContract[],
    kecamatan: KecamatanContract[],
}

export interface AutocompleteContract {
    label: String,
    provinsi: String,
    kota: String,
    kecamatan: String,
    id: Number,
    postal_code: Number | null
}

export const Address: AddressContract = {
    provinsi, kota, kecamatan
}

export function findById(type: 'kecamatan', id: Number): KecamatanContract
export function findById(type: 'kota', id: Number): KotaContract
export function findById(type: 'provinsi', id: Number): ProvinsiContract
export function findById(type: any, id: Number): any {
    return Address[type].filter(ad => ad.id == id)[0]
}


export const flattenAddress = () => {
    return Address.kecamatan.map(k => {
        const kabkotLabel = kota.filter(kt => kt.id == k.kota_id)[0]
        const provinsiLabel = provinsi.filter(pro => pro.id == k.provinsi_id)[0]
        return {
            provinsi: provinsiLabel.name,
            kota: kabkotLabel.name,
            kecamatan: k.name,
            postal_code: k.postal_code,
            label: `${k.name}, ${kabkotLabel.name}, ${provinsiLabel.name}, ${k.postal_code}`,
            id: k.id
        }
    })
}