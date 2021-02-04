/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from "@ioc:Adonis/Core/Route";
import Queue from "@ioc:Adonis5/Queue";
import ExampleJob from "App/Jobs/Producers/ExampleJob";
import kue from "kue";

Route.on("/").render("welcome");
Route.get("/run-job", async () => {
  const data = {
    user_id: 2,
    first_name: "Khoirul",
    last_name: "Fatihin",
  };
  Queue.dispatch(new ExampleJob({ data }), "1 minutes from now");
  return "This is the about page";
});

Route.get("/clear-job", async () => {
  Queue.clear().then(
    (response) => {
      console.log(response);
    },
    (error) => {
      console.log(error);
    }
  );
});

Route.get("/remove-complete-job", async () => {
  kue.Job.rangeByState("complete", 0, -1, "asc", (_, jobs) => {
    jobs.forEach(async (job) => {
      job.remove(() => {
        console.log("removed ", job.id);
      });
    });
  });
});
