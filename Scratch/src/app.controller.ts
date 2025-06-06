import { Controller, Get } from "@nestjs/common";

@Controller("/app")
export class AppController {
  // we can pass route path as argeument in get decorater
  @Get("user")
  getRootRoute() {
    return "user";
  }
}
