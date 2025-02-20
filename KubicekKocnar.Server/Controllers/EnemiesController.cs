using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
            return await _context.Enemies.ToListAsync();
        }

        // GET: api/Enemies/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Enemy>> GetEnemy(uint id)
        {
            var enemy = await _context.Enemies.FindAsync(id);

            if (enemy == null)
            {
                return NotFound();
            }

            return enemy;
        }

        // PATCH: api/Blocks/5 using JsonPatchDocument
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> PatchEnemy(uint id, [FromBody] JsonPatchDocument<Enemy> patch)
        {
            var block = await _context.Enemies.FindAsync(id);
            if (block == null)
            {
                return NotFound();
            }
            patch.ApplyTo(block, ModelState);
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        public class EnemyDto
        {
            public string Name { get; set; }
            public float Health { get; set; }
            public float Damage { get; set; }
            public float AttackSpeed { get; set; }
            public float Speed { get; set; }
            public bool IsGhost { get; set; }
            public uint TextureId { get; set; }
            public List<uint> LevelIds { get; set; }

            public Enemy ToEnemy() => new Enemy
            {
                Name = Name,
                Health = Health,
                Damage = Damage,
                AttackSpeed = AttackSpeed,
                Speed = Speed,
                IsGhost = IsGhost,
                TextureId = TextureId
            };
        }

        // POST: api/Enemies
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Enemy>> PostEnemy(EnemyDto enemyDto)
        {
            if (enemyDto.Health <= 0) return BadRequest("Health must be greater than 0");
            if (enemyDto.AttackSpeed <= 0) return BadRequest("AttackSpeed must be greater than 0");
            if (enemyDto.Speed <= 0) return BadRequest("Speed must be greater than 0");

            Enemy enemy = enemyDto.ToEnemy();

            var texture = await _context.Textures.FindAsync(enemyDto.TextureId);
            if (texture == null) return BadRequest($"Texture with id {enemyDto.TextureId} does not exists");

            // Attach existing levels to the context and add them to the enemy
            foreach (var levelId in enemyDto.LevelIds)
            {
                var level = await _context.Levels.FindAsync(levelId);
                if (level != null)
                {
                    enemy.Levels.Add(level);
                    _context.Update(level);
                }
                else
                {
                    return BadRequest($"Level with id {levelId} does not exists");
                }
            }

            _context.Enemies.Add(enemy);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetEnemy", new { id = enemy.EnemyId }, enemy);
        }

        // DELETE: api/Enemies/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteEnemy(uint id)
        {
            var enemy = await _context.Enemies.FindAsync(id);
            if (enemy == null)
            {
                return NotFound();
            }

            _context.Enemies.Remove(enemy);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool EnemyExists(uint id)
        {
            return _context.Enemies.Any(e => e.EnemyId == id);
        }
    }
}
