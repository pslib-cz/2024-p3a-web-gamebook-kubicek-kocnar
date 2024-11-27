using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;
using Microsoft.AspNetCore.Mvc;

namespace KubicekKocnar.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LevelController : Controller
    {
        private readonly AppDbContext _context;

        public LevelController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost(Name = "PostLevel")]
        public IActionResult Post(string name)
        {
            _context.Levels.Add(new Level() { Name = name });

            _context.SaveChanges();

            return Ok(_context.Levels);
        }

        [HttpGet(Name = "GetLevels")]
        public async Task<ActionResult<IEnumerable<Level>>> GetLevels()
        {
            return Ok(_context.Levels);
        }

        [HttpDelete("{id}", Name = "DeleteLevel")]
        public async Task<ActionResult<IEnumerable<Level>>> DeleteLevel(int id)
        {
            var level = await _context.Levels.FindAsync(id);

            if (level == null) return NotFound();

            _context.Levels.Remove(level);

            await _context.SaveChangesAsync();

            return Ok(_context.Levels);
        }
    }
}
