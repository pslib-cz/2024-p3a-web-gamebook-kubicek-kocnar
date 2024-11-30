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
    public class GamesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GamesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Games
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Game>>> GetGames() => await _context.Games.ToListAsync();

        // GET: api/Games/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Game>> GetGame(uint id)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            return game;
        }

        // PUT: api/Games/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutGame(uint id, Game game)
        {
            if (id != game.GameId) return BadRequest();

            _context.Entry(game).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GameExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // POST: api/Games
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Game>> PostGame(Game game)
        {
            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGame", new { id = game.GameId }, game);
        }

        // DELETE: api/Games/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGame(uint id)
        {
            var game = await _context.Games.FindAsync(id);
            if (game == null)
            {
                return NotFound();
            }

            _context.Games.Remove(game);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool GameExists(uint id)
        {
            return _context.Games.Any(e => e.GameId == id);
        }

        // GET: api/Games/5/Levels
        [HttpGet("{id}/Levels")]
        public async Task<ActionResult<IEnumerable<Level>>> GetLevels(uint id)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            return Ok(game.Levels);
        }

        // POST: api/Games/5/Levels
        [HttpPost("{id}/Levels")]
        public async Task<ActionResult<Level>> PostLevel(uint id, Level level)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            await _context.Entry(game).Collection(g => g.Levels).LoadAsync();

            game.Levels.Add(level);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLevel", new { id = level.LevelId }, level);
        }

        // DELETE: api/Games/5/Levels/5
        [HttpDelete("{id}/Levels/{levelId}")]
        public async Task<IActionResult> DeleteLevel(uint id, uint levelId)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            game.Levels.Remove(level);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Patch a level
        [HttpPatch("{id}/Levels/{levelId}")]
        public async Task<IActionResult> PatchLevel(uint id, uint levelId, [FromBody] JsonPatchDocument<Level> patchDoc)
        {
            if (patchDoc == null) return BadRequest();

            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            patchDoc.ApplyTo(level, ModelState);

            if (!TryValidateModel(level)) return ValidationProblem(ModelState);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Blocks under a level
        [HttpGet("{id}/Levels/{levelId}/Blocks")]
        public async Task<ActionResult<IEnumerable<PlacedBlock>>> GetBlocks(uint id, uint levelId)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            return Ok(level.Blocks);
        }

        // POST: api/Games/5/Levels/5/Blocks
        [HttpPost("{id}/Levels/{levelId}/Blocks")]
        public async Task<ActionResult<PlacedBlock>> PostBlock(uint id, uint levelId, PlacedBlock block)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            level.Blocks.Add(block);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBlock", new { id = block.PlacedBlockId }, block);
        }

        // DELETE: api/Games/5/Levels/5/Blocks/5
        [HttpDelete("{id}/Levels/{levelId}/Blocks/{blockId}")]
        public async Task<IActionResult> DeleteBlock(uint id, uint levelId, uint blockId)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            var block = level.Blocks.FirstOrDefault(b => b.PlacedBlockId == blockId);

            if (block == null) return NotFound();

            level.Blocks.Remove(block);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Patch a block
        [HttpPatch("{id}/Levels/{levelId}/Blocks/{blockId}")]
        public async Task<IActionResult> PatchBlock(uint id, uint levelId, uint blockId, [FromBody] JsonPatchDocument<PlacedBlock> patchDoc)
        {
            if (patchDoc == null) return BadRequest();

            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            var block = level.Blocks.FirstOrDefault(b => b.PlacedBlockId == blockId);

            if (block == null) return NotFound();

            patchDoc.ApplyTo(block, ModelState);

            if (!TryValidateModel(block)) return ValidationProblem(ModelState);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Features under a level
        [HttpGet("{id}/Levels/{levelId}/Features")]
        public async Task<ActionResult<IEnumerable<Feature>>> GetFeatures(uint id, uint levelId)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            return Ok(level.Features);
        }

        // POST: api/Games/5/Levels/5/Features
        [HttpPost("{id}/Levels/{levelId}/Features")]
        public async Task<ActionResult<Feature>> PostFeature(uint id, uint levelId, Feature feature)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            level.Features.Add(feature);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFeature", new { id = feature.FeatureId }, feature);
        }

        // DELETE: api/Games/5/Levels/5/Features/5
        [HttpDelete("{id}/Levels/{levelId}/Features/{featureId}")]
        public async Task<IActionResult> DeleteFeature(uint id, uint levelId, uint featureId)
        {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            var feature = level.Features.FirstOrDefault(f => f.FeatureId == featureId);

            if (feature == null) return NotFound();

            level.Features.Remove(feature);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Patch a feature
        [HttpPatch("{id}/Levels/{levelId}/Features/{featureId}")]
        public async Task<IActionResult> PatchFeature(uint id, uint levelId, uint featureId, [FromBody] JsonPatchDocument<Feature> patchDoc)
        {
            if (patchDoc == null) return BadRequest();

            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            var level = game.Levels.FirstOrDefault(l => l.LevelId == levelId);

            if (level == null) return NotFound();

            var feature = level.Features.FirstOrDefault(f => f.FeatureId == featureId);

            if (feature == null) return NotFound();

            patchDoc.ApplyTo(feature, ModelState);

            if (!TryValidateModel(feature)) return ValidationProblem(ModelState);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
