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
            string pdfFilePath = path + "\\Resume_Brijen_Makwana.pdf";
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
            foreach (var file in files)
            {

                byte[] bytes = System.IO.File.ReadAllBytes(file);
                var fileInfo = new System.IO.FileInfo(file);
                filesModel.Add(new FileModel()
                {
                    FileData = Convert.ToBase64String(bytes),
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
        public ActionResult<bool> SaveFile([FromForm]IFormFile file)
        {
            var filePath = Path.Combine(Environment.CurrentDirectory + "\\files\\", file.FileName);
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                var fileBytes = ms.ToArray();
                System.IO.File.WriteAllBytes(filePath, fileBytes);
            }

           
            var fileInfo = new System.IO.FileInfo(filePath);
            var fileModel = new FileModel();

            fileModel.FileData = Convert.ToBase64String(System.IO.File.ReadAllBytes(filePath));
            fileModel.FileName = Path.GetFileName(filePath);
            fileModel.LastModifiedDate = fileInfo.LastWriteTimeUtc.ToString("dd-MM-yyyy");
            fileModel.Id = 1;
            fileModel.Size = $"{fileInfo.Length} bytes";

            return Ok(fileModel);
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult Save(FileModel model)
        {
            byte[] bytes = Convert.FromBase64String(model.FileData);
            var filePath = Path.Combine(Environment.CurrentDirectory + "\\files\\", model.FileName + ".pdf");
            System.IO.File.WriteAllBytes(filePath, bytes);
            return Ok();
        }

        [HttpPost]
        [Route("[action]")]
        public IActionResult AutoMerge(List<FileModel> models)
        {
            byte[] bytes = Convert.FromBase64String(models[0].FileData);
            byte[] secondbytes = Convert.FromBase64String(models[1].FileData);
            byte[] combinedArray = new byte[bytes.Length + secondbytes.Length];
            Array.Copy(bytes, 0, combinedArray, 0, bytes.Length);
            Array.Copy(secondbytes, 0, combinedArray, bytes.Length, secondbytes.Length);
            
            var filePath = Path.Combine(Environment.CurrentDirectory + "\\files\\", models[0].FileName + ".pdf");
            System.IO.File.WriteAllBytes(filePath, combinedArray);
            return Ok();
        }

    }
}