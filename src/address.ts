import { provinsi, kota, kecamatan } from './assets/wilayah.json'
import ArrayMap from 'lodash.map'
import ArrayFilter from 'lodash.filter'
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

export const Address: AddressContract = {
    provinsi, kota, kecamatan
}
export function findById<T extends keyof AddressContract>(type: T, id: Number): KecamatanContract | KotaContract | ProvinsiContract
export function findById(type: any, id: any): any {
    return ArrayFilter(Address[type], (value) => value.id == id)[0]
}


export const flattenAddress = () => {
    return ArrayMap(Address.kecamatan, k => {
        const kabkotLabel = findById('kota', k.kota_id)
        const provinsiLabel = findById('provinsi', k.provinsi_id)
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