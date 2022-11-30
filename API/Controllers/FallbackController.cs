using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [AllowAnonymous] // to allow everybody to access it
    public class FallbackController : ControllerBase // it only return a View (which is an html page)
    {
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
            // from current directory, search inside "wwwroot" folder the file "index.html" which is of type "text/HTML"
        }
    }
}