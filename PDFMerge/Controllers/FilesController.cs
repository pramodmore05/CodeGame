using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Bytescout.PDF2HTML;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Spire.Pdf;
using System.IO;
using PDFMerge.Models;

namespace PDFMerge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        [HttpGet]
        [Route("[action]")]
        public ActionResult<List<FileModel>> GetFiles()
        {
            var filesModel = new List<FileModel>();
            var path = Environment.CurrentDirectory + "\\files";
            string[] files = System.IO.Directory.GetFiles(path, "*.pdf");
            foreach(var file in files)
            {
                PdfDocument pdf = new PdfDocument();
                pdf.LoadFromFile(file);
                pdf.SaveToFile("Result.html", FileFormat.HTML);
                string html = System.IO.File.ReadAllText("Result.html");
                filesModel.Add(new FileModel()
                {
                    FileData = html,
                    FileName = Path.GetFileName(file)
                });
            }
            return Ok(filesModel);
        }
        
        [HttpPost]
        [Route("[action]")]
        public ActionResult<bool> SaveFile(IFormFile file)
        {
            var filePath = Path.Combine(Environment.CurrentDirectory + "\\files\\", file.FileName);
            PdfDocument pdf = new PdfDocument();
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                var fileBytes = ms.ToArray();
                pdf.LoadFromBytes(fileBytes);
                pdf.SaveToFile(filePath, FileFormat.PDF);
            }
            return true;
        }
    }
}