using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace PDFMerge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        [HttpGet]
        [Route("[action]")]
        public ActionResult<string> GetFiles()
        {
            var path = Environment.CurrentDirectory + "\files";
            string[] files = System.IO.Directory.GetFiles(path, "*.pdf");

            return Ok(path);
        } 
    }
}