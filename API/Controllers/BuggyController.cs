using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController: BaseApiController
    {
        [HttpGet("not-found")]
        public ActionResult GetNotFound() {
            return NotFound(); // returns 404 message
        }
        [HttpGet("bad-request")]
        public ActionResult GetBadRequest() {
            return BadRequest(new ProblemDetails{ Title = "This is a bad request" }); // returns 400 message
        }
        [HttpGet("unauthorized")]
        public ActionResult GetUnauthorized() {
            return Unauthorized(); // returns 401 message
        }
        [HttpGet("validation-error")]
        public ActionResult GetValidationError() {
            ModelState.AddModelError("Pb1", "This is the first error");
            ModelState.AddModelError("Pb2", "This is the second error");
            return ValidationProblem(); // returns 400 message
        }
        [HttpGet("server-error")]
        public ActionResult GetServerError() {
            throw new Exception("This is server error"); // returns the message of the error
        }
    }
}