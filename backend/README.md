# Patient Visi Tracker

**Requirement**
> NodeJs (22.16.0)
> NPM (11.4.1)
> POSTGRESQL

**Run**
> Dev:
    >> npm run start

> Prod:
    >> npm run start-prod      


**Generate New Migration With Model**
> npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

**Add New migration**
> npx sequelize-cli migration:create --name modify_users_add_new_fields

**Migrate**
> Dev:
    >> npm run migrate-dev

> Production
    >> npm run migrate-prod

**Seeder**
> Generate:
    >> npx sequelize-cli seed:generate --name member-user

> Execute:
    >> npx sequelize-cli db:seed:all
