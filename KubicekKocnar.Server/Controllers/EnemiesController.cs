using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;
using Microsoft.AspNetCore.JsonPatch;

namespace KubicekKocnar.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnemiesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public EnemiesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Enemies
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Enemy>>> GetEnemy()
        {
            return await _context.Enemy.ToListAsync();
        }

        // GET: api/Enemies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Enemy>> GetEnemy(uint id)
        {
            var enemy = await _context.Enemy.FindAsync(id);

            if (enemy == null)
            {
                return NotFound();
            }

            return enemy;
        }

        // PATCH: api/Blocks/5 using JsonPatchDocument
        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchBlock(uint id, [FromBody] JsonPatchDocument<Block> patch) {
            var block = await _context.Blocks.FindAsync(id);
            if (block == null) {
                return NotFound();
            }
            patch.ApplyTo(block, ModelState);
            if (!ModelState.IsValid) {
                return BadRequest(ModelState);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/Enemies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Enemy>> PostEnemy(Enemy enemy)
        {
            _context.Enemy.Add(enemy);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEnemy", new { id = enemy.EnemyId }, enemy);
        }

        // DELETE: api/Enemies/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEnemy(uint id)
        {
            var enemy = await _context.Enemy.FindAsync(id);
            if (enemy == null)
            {
                return NotFound();
            }

            _context.Enemy.Remove(enemy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnemyExists(uint id)
        {
            return _context.Enemy.Any(e => e.EnemyId == id);
        }
    }
}
