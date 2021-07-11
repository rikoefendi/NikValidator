import { findById, KecamatanContract } from './address'
import { DateTime } from 'luxon'
export type NikResult = {
    provinsi: String,
    kota: String,
    kecamatan: String,
    kodepos: String | null,
    kelamin: String,
    lahir: String,
    umur: Number,
    uniqcode: String,
}
export type NikResultInvalid = {
    isValid: Boolean
}
class ParseNIK {
    private date: String
    private month: String
    private year: String
    private gender: String
    private provinsi: String
    private kota: String
    private kecamatan: KecamatanContract
    constructor(public NIK: string) {
        this.provinsi = findById('provinsi', this.parseNIK(0, 2)).name
        this.kota = findById('kota', this.parseNIK(0, 4)).name
        this.kecamatan = findById('kecamatan', this.parseNIK(0, 6))
        this.date = this.getDateFull();
        this.gender = this.getGender()
        this.month = this.getMonthFull()
        this.year = this.getYearFull();
    }
    private parseNIK(start: number, end: number) {
        return parseInt(this.NIK.substr(start, end))
    }
    private getCurrentYear() {
        return parseInt(new Date().getFullYear().toString().substr(-2));
    }
    private getYearFull() {
        const nikYear = this.parseNIK(10, 2)
        const currentYear = this.getCurrentYear()
        return nikYear < currentYear
            ? `20${nikYear > 10 ? nikYear : '0' + nikYear.toString()}`
            : `19${nikYear > 10 ? nikYear : '0' + nikYear.toString()}`;
    }
    private getMonthFull() {
        let date = this.parseNIK(8, 2)
        return date > 10 ? String(date) : `0${date}`
    }
    private getNIKDate() {
        return this.parseNIK(6, 2);
    }
    private getDateFull() {
        let date = this.getNIKDate();
        if (date > 40) {
            date -= 40;
        }
        return date > 10 ? date.toString() : `0${date}`;
    }
    private getGender() {
        return this.getNIKDate() > 40 ? "PEREMPUAN" : "LAKI-LAKI"
    }

    private getDateString() {
        return DateTime.fromFormat(`${this.date}/${this.month}/${this.year}`, 'dd/MM/yyyy')
    }
    //Get unique code in NIK
    private getUniqueCode() {
        return String(this.NIK.substr(12, 4));
    }
    parse(): NikResult | NikResultInvalid | Boolean {
        if (!this.validate())
            return false

        return {
            provinsi: this.provinsi,
            kota: this.kota,
            kecamatan: this.kecamatan.name,
            kodepos: String(this.kecamatan.postal_code),
            kelamin: this.gender,
            lahir: this.getDateString().toFormat('dd MMMM yyyy', { locale: 'id-ID' }),
            umur: Math.abs(Math.trunc(this.getDateString().diffNow('years').years)),
            uniqcode: this.getUniqueCode(),
        }
    }

    validate() {
        return this.NIK.length === 16 && !!this.provinsi && !!this.kota && !!this.kecamatan.name
    }
}

export function parseNIK(nik) {
    if (typeof nik == 'number') nik = String(nik)
    return new ParseNIK(nik).parse()
}