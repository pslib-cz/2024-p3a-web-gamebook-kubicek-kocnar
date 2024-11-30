using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;

namespace KubicekKocnar.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Levels1Controller : ControllerBase
    {
        private readonly AppDbContext _context;

        public Levels1Controller(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Levels1
        /*[HttpGet]
        public async Task<ActionResult<IEnumerable<Level>>> GetLevels()
        {
            return await _context.Levels.Include(s => s.Game).ToListAsync();
        }*/

        // GET: api/Levels1/5
        /*[HttpGet("{id}")]
        public async Task<ActionResult<Level>> GetLevel(uint id)
        {
            var level = await _context.Levels.Include(s => s.Game).Where(x => x.LevelId == id).FirstOrDefaultAsync();

            if (level == null)
            {
                return NotFound();
            }

            return level;
        }*/

        // PUT: api/Levels1/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLevel(uint id, Level level)
        {
            if (id != level.LevelId)
            {
                return BadRequest();
            }

            _context.Entry(level).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LevelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Levels1
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Level>> PostLevel(Level level)
        {
            _context.Levels.Add(level);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLevel", new { id = level.LevelId }, level);
        }

        // DELETE: api/Levels1/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLevel(uint id)
        {
            var level = await _context.Levels.FindAsync(id);
            if (level == null)
            {
                return NotFound();
            }

            _context.Levels.Remove(level);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LevelExists(uint id)
        {
            return _context.Levels.Any(e => e.LevelId == id);
        }
    }
}
