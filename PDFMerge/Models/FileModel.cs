using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PDFMerge.Models
{
    public class FileModel
    {
        public int Id { get; set; }
        public string Size { get; set; }
        public string FileName { get; set; }
        public string FileData { get; set; }
        public string LastModifiedDate { get; set; }
        public byte[] Data { get; set; }
    }
}
