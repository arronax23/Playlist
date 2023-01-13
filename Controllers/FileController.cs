using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Playlist.Data;
using System.Data;
using System.Numerics;

namespace Playlist.Controllers
{
    [ApiController]
    public class FileController : ControllerBase
    {
        [HttpPost("api/UploadFile")]
        public IActionResult UploadFile(IFormFile formFile)
        {

            return Ok();
        }
    }
}
