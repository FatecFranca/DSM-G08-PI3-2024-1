"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactory = void 0;
const faker_1 = require("@faker-js/faker");
const cpf_1 = require("@fnando/cpf");
const fakerBR = new faker_1.Faker({
    locale: [faker_1.pt_BR]
});
const defaultUserProps = {
    name: 'any_name',
    lastName: 'any_last_name',
    email: 'any@email.com',
    cpf: (0, cpf_1.generate)(true),
    gender: 'M',
    data_nascimento: new Date('1998-10-10'),
    password: 'any_password',
    address: {
        cep: 'any_cep',
        street: 'any_street',
        num: '123',
        city: 'any_city',
        uf: 'SP'
    },
    healthInfo: {
        allergy: 'any_allergy',
        cardiorespiratoryDisease: 'any_cardiorespiratoryDisease',
        medicineInUse: 'any_medicineInUse',
        preExistingCondition: 'any_preExistingCondition',
        surgery: 'any_surgery',
    }
};
class UserFactory {
    constructor() {
        this.user = Object.assign({}, defaultUserProps);
    }
    with(overrides) {
        this.user = Object.assign(Object.assign({}, this.user), overrides);
        return this;
    }
    healthInfoWith(overrides) {
        this.user.healthInfo = Object.assign(Object.assign({}, this.user.healthInfo), overrides);
        return this;
    }
    addressWith(overrides) {
        this.user.address = Object.assign(Object.assign({}, this.user.address), overrides);
        return this;
    }
    withoutHealthInfo() {
        delete this.user.healthInfo;
        return this;
    }
    build() {
        return this.user;
    }
    randomize() {
        const fakePerson = fakerBR.person;
        return this.with({
            name: fakePerson.firstName(),
            lastName: fakePerson.lastName(),
            cpf: (0, cpf_1.generate)(true),
            data_nascimento: fakerBR.date.birthdate(),
            email: fakerBR.internet.email(),
            gender: faker_1.fakerEN_US.person.gender() === 'female' ? 'F' : 'M',
            password: fakerBR.internet.password(),
        });
    }
    static random() {
        return new UserFactory().randomize().build();
    }
    static randomList(size) {
        return Array.from({ length: size }, () => UserFactory.random());
    }
}
exports.UserFactory = UserFactory;
