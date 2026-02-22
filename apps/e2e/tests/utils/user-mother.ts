import type { RegistrationBody } from "@linku/api-contract";
import { faker } from "@faker-js/faker";

export const UserMother = {
  createRegistration(overrides?: Partial<RegistrationBody>): RegistrationBody {
    return {
      email: faker.internet.email(),
      username: faker.internet.username(),
      password: generatePassword(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      ...overrides,
    };
  },
};

function generatePassword() {
  const minLength = 8;

  const upper = faker.string.alpha({ casing: "upper" });
  const lower = faker.string.alpha({ casing: "lower" });
  const number = faker.string.numeric(1);
  const special = faker.string.symbol(1);

  const remainingLength = minLength - 4;
  const remaining = faker.string.alphanumeric(remainingLength);
  const combined = upper + lower + number + special + remaining;

  return faker.helpers.shuffle(combined.split("")).join("");
}
