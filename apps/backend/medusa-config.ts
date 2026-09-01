import path from "path"

import { QUOTE_MODULE } from "./src/modules/quote"
import { APPROVAL_MODULE } from "./src/modules/approval"
import { COMPANY_MODULE } from "./src/modules/company"
import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const localPackageDir = (pkg: string) =>
  path.dirname(require.resolve(`${pkg}/package.json`))

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,

    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET,
      cookieSecret: process.env.COOKIE_SECRET,
    },
  },

  admin: {
    vite: () => ({
      resolve: {
        alias: {
          react: localPackageDir("react"),
          "react-dom": localPackageDir("react-dom"),
        },
        dedupe: ["react", "react-dom"],
      },
    }),
  },

  modules: {
    [COMPANY_MODULE]: {
      resolve: "./modules/company",
    },

    [QUOTE_MODULE]: {
      resolve: "./modules/quote",
    },

    [APPROVAL_MODULE]: {
      resolve: "./modules/approval",
    },
  },
})