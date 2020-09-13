import { cleanEnv, url } from 'envalid'

export default function (): void {
  cleanEnv(process.env, {
    DATABASE_URL: url({ desc: 'Postgres Database URL' }),
  })
}
