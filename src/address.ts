import {provinces, cities, districts} from './assets/location.json'
import ArrayMap from 'lodash.map'
import ArrayFilter from 'lodash.filter'
export type ProvinceContract = {
    id: number
    name: String
}
export type CityContract = {
    id: number
    province_id: ProvinceContract['id']
    name: String
}
export type DistrictContract = {
    id: number,
    province_id: ProvinceContract['id']
    city_id: CityContract['id'],
    postal_code: number | null,
    name: String
}

export type AddressContract = {
    provinces: ProvinceContract[],
    cities: CityContract[],
    districts: DistrictContract[],
}
export const Address: AddressContract = {
    provinces, cities, districts
}

export function findById<T extends keyof AddressContract>(type: T, id: Number): DistrictContract | CityContract | ProvinceContract
export function findById(type: any, id: any): any {
    return ArrayFilter(Address[type], (value) => value.id == id)[0]
}


export const flattenAddress = () => {
    return ArrayMap(districts, k => {
        const kabkotLabel = findById('cities', k.city_id)
        const provinceLabel = findById('provinces', k.province_id)
        let label = `${k.name.trim()}, ${kabkotLabel.name}, ${provinceLabel.name}`
        if (k.postal_code) label += `, ${k.postal_code}`
        return {
            province: provinceLabel.name,
            city: kabkotLabel.name,
            district: k.name,
            postal_code: k.postal_code,
            label,
            id: k.id
        }
    })
}