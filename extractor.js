"use strict";
exports.__esModule = true;
var wilayah_json_1 = require("nik-parser/src/wilayah.json");
var promises_1 = require("fs/promises");
var provinces = [];
var cities = [];
var districts = [];
Object.keys(wilayah_json_1.provinsi).map(function (p) {
    var province = {
        id: Number(p),
        name: wilayah_json_1.provinsi[p]
    };
    provinces.push(province);
});
Object.keys(wilayah_json_1.kabkot).map(function (k) {
    var city = {
        id: Number(k.substr(0, 4)),
        province_id: Number(k.substr(0, 2)),
        name: wilayah_json_1.kabkot[k]
    };
    cities.push(city);
});
Object.keys(wilayah_json_1.kecamatan).map(function (k) {
    var district = {
        id: Number(k.substr(0, 6)),
        province_id: Number(k.substr(0, 2)),
        city_id: Number(k.substr(0, 4)),
        postal_code: Number(wilayah_json_1.kecamatan[k].slice(-5)),
        name: wilayah_json_1.kecamatan[k].split('--')[0].trim()
    };
    districts.push(district);
});
var data = { provinces: provinces, cities: cities, districts: districts
};
promises_1.writeFile('./src/assets/location.json', JSON.stringify(data));
