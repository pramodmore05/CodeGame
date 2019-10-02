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
using System.Text;
using System.Drawing;
using Spire.Pdf.Graphics;
using Spire.Pdf.HtmlConverter;

namespace PDFMerge.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        [HttpGet]
        [Route("[action]")]
        public ActionResult<FileModel> GetFile()
        {
            var fileModel = new FileModel();
            var path = Environment.CurrentDirectory + "\\files";
            string pdfFilePath = path +"\\1.pdf";
            byte[] bytes = System.IO.File.ReadAllBytes(pdfFilePath);
            return new FileModel()
            {
                FileData = Convert.ToBase64String(bytes, 0, bytes.Length),
                Data = bytes,
                FileName = Path.GetFileName(pdfFilePath),
                LastModifiedDate = "",
                Id = 1,
                Size = $"192 bytes"
            };
        }

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
                var fileInfo = new System.IO.FileInfo(file);
                filesModel.Add(new FileModel()
                {
                    FileData = html,
                    FileName = Path.GetFileName(file),
                    LastModifiedDate = fileInfo.LastWriteTimeUtc.ToString("dd-MM-yyyy"),
                    Id = 1,
                    Size = $"{fileInfo.Length} bytes" 
                });
            }
            return Ok(filesModel);
        }
        
        [HttpPost]
        [Route("[action]")]
        public ActionResult<bool> UploadFile(IFormFile file)
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

        [HttpPost]
        [Route("[action]")]
        public ActionResult<bool> Save(FileModel model)
        {
            return false;
            //PdfDocument pdf = new PdfDocument();
            //string input = @"<strong>This is a test for converting HTML string to PDF </strong>
            //     <ul><li>Spire.PDF supports to convert HTML in URL into PDF</li>
            //     <li>Spire.PDF supports to convert HTML string into PDF</li>
            //     <li>With the new plugin</li></ul>";

            //Spire.Pdf.HtmlConverter.Qt.HtmlConverter.Convert(input, "1.pdf", true, 10 * 1000, new SizeF(612, 792), new PdfMargins(0), LoadHtmlType.SourceCode);
            //pdf.LoadFromFile("Result.html", FileFormat.HTML);
            //var filePath = Path.Combine(Environment.CurrentDirectory + "\\files\\", model.FileName + ".pdf");
            //byte[] bytes = Encoding.ASCII.GetBytes(model.FileData);
            ////pdf.LoadFromBytes(bytes);
            //pdf.SaveToFile(filePath, FileFormat.PDF);
            //return true;
        }

    }
}