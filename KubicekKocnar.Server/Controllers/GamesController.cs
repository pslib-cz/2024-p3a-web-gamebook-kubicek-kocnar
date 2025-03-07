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
using Microsoft.AspNetCore.Authorization;

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

        // PATCH: api/Games/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPatch("{id}")]
        [Authorize]
        public async Task<IActionResult> PatchGame(uint id, [FromBody] JsonPatchDocument<Game> patchDoc) {
            if (patchDoc == null) return BadRequest();

            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            patchDoc.ApplyTo(game, ModelState);

            if (!TryValidateModel(game)) return ValidationProblem(ModelState);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Games
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Game>> PostGame(Game game)
        {
            _context.Games.Add(game);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetGame", new { id = game.GameId }, game);
        }

        // DELETE: api/Games/5
        [HttpDelete("{id}")]
        [Authorize]
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

        //private bool GameExists(uint id)
        //{
        //    return _context.Games.Any(e => e.GameId == id);
        //}

        // GET: api/Games/5/Levels
        [HttpGet("{id}/Levels")]
        public async Task<ActionResult<IEnumerable<Level>>> GetLevels(uint id) => await _context.Levels.Include((x) => x.Enemies).Where(l => l.GameId == id).ToListAsync();

        [HttpGet("{id}/Levels/{levelId}/Enemies")]
        public async Task<ActionResult<IEnumerable<Enemy>>> GetEnemies(uint id, uint levelId) 
            => await _context.Enemies.Where(e => e.Levels.FirstOrDefault(x => x.LevelId == levelId) != null).ToListAsync();

        // GET: api/Games/5/Levels/5
        [HttpGet("{id}/Levels/{levelId}")]
        public async Task<ActionResult<Level>> GetLevel(uint id, uint levelId) {
            var level = await _context.Levels.Include((x) => x.Enemies).Where(l => l.GameId == id && l.LevelId == levelId).FirstOrDefaultAsync();

            if (level == null) return NotFound();

            return level;
        }


        // POST: api/Games/5/Levels
        [HttpPost("{id}/Levels")]
        [Authorize]
        public async Task<ActionResult<Level>> PostLevel(uint id, Level level) {
            var game = await _context.Games.FindAsync(id);

            if (game == null) return NotFound();

            game.Levels.Add(level);

            var block = new PlacedBlock {
                BlockId = 1,
                LevelId = level.LevelId,
                X = 0,
                Y = 0,
                Z = 0,
                Created = DateTime.Now,
                State = ""
            };
            level.Blocks.Add(block);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLevel", new { id = level.GameId, levelId = level.LevelId }, level);
        }

        // DELETE: api/Games/5/Levels/5
        [HttpDelete("{id}/Levels/{levelId}")]
        [Authorize]
        public async Task<IActionResult> DeleteLevel(uint id, uint levelId)
        {
            var level = await _context.Levels.Where(l => l.GameId == id && l.LevelId == levelId).FirstOrDefaultAsync();

            if (level == null) return NotFound();

            _context.Levels.Remove(level);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Patch a level
        [HttpPatch("{id}/Levels/{levelId}")]
        [Authorize]
        public async Task<IActionResult> PatchLevel(uint id, uint levelId, [FromBody] JsonPatchDocument<Level> patchDoc)
        {
            if (patchDoc == null) return BadRequest();

            var level = await _context.Levels.Where(l => l.GameId == id && l.LevelId == levelId).FirstOrDefaultAsync();

            if (level == null) return NotFound();

            patchDoc.ApplyTo(level, ModelState);

            if (!TryValidateModel(level)) 
                return ValidationProblem(ModelState);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Blocks under a level
        [HttpGet("{id}/Levels/{levelId}/Blocks")]
        public async Task<ActionResult<IEnumerable<PlacedBlock>>> GetBlocks(uint id, uint levelId)
        {
            var level = await _context.Levels.Where(l => l.GameId == id && l.LevelId == levelId).Include(l => l.Blocks).FirstOrDefaultAsync();

            if (level == null) return NotFound();

            return Ok(level.Blocks);
        }

        // Blocks under a level
        [HttpGet("{id}/Levels/{levelId}/Blocks/{blockId}")]
        public async Task<ActionResult<IEnumerable<PlacedBlock>>> GetBlock(uint? id, uint levelId, uint blockId) {
            var block = await _context.PlacedBlocks.Where(b => b.LevelId == levelId && b.PlacedBlockId == blockId).FirstOrDefaultAsync();

            if (block == null) return NotFound();

            return Ok(block);
        }

        // POST: api/Games/5/Levels/5/Blocks
        [HttpPost("{id}/Levels/{levelId}/Blocks")]
        [Authorize]
        public async Task<ActionResult<PlacedBlock>> PostBlock(uint id, uint levelId, PlacedBlock block)
        {
            var level = await _context.Levels.Where(l => l.GameId == id && l.LevelId == levelId).FirstOrDefaultAsync();

            if (level == null) return NotFound();

            level.Blocks.Add(block);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBlock", new { id, levelId, blockId = block.PlacedBlockId }, block);
        }

        // DELETE: api/Games/5/Levels/5/Blocks/5
        [HttpDelete("{id}/Levels/{levelId}/Blocks/{blockId}")]
        [Authorize]
        public async Task<IActionResult> DeleteBlock(uint id, uint levelId, uint blockId)
        {
            var block = await _context.PlacedBlocks.Where(b => b.LevelId == levelId && b.PlacedBlockId == blockId).FirstOrDefaultAsync();

            if (block == null) return NotFound();

            _context.PlacedBlocks.Remove(block);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Patch a block
        [HttpPatch("{id}/Levels/{levelId}/Blocks/{blockId}")]
        [Authorize]
        public async Task<IActionResult> PatchBlock(uint id, uint levelId, uint blockId, [FromBody] JsonPatchDocument<PlacedBlock> patchDoc)
        {
            if (patchDoc == null) return BadRequest();

            var block = _context.PlacedBlocks.FirstOrDefault(b => b.PlacedBlockId == blockId && b.LevelId == levelId);

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
            var level = await _context.Levels.Where(l => l.GameId == id && l.LevelId == levelId).Include(l => l.Features).FirstOrDefaultAsync();

            if (level == null) return NotFound();

            return Ok(level.Features);
        }

        // GET: api/Games/5/Levels/5/Feature/5
        [HttpGet("{id}/Levels/{levelId}/Features/{featureId}")]
        public async Task<ActionResult<IEnumerable<Feature>>> GetFeature(uint? id, uint levelId, uint featureId) {

            var feature = await _context.Features.FirstOrDefaultAsync(f => f.FeatureId == featureId && f.LevelId == levelId);

            if (feature == null) return NotFound();

            return Ok(feature);
        }

        // POST: api/Games/5/Levels/5/Features
        [HttpPost("{id}/Levels/{levelId}/Features")]
        [Authorize]
        public async Task<ActionResult<Feature>> PostFeature(uint id, uint levelId, Feature feature)
        {
            var level = await _context.Levels.Where(l => l.GameId == id && l.LevelId == levelId).FirstOrDefaultAsync();

            if (level == null) return NotFound();

            level.Features.Add(feature);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFeature", new { id = level.GameId, levelId= level.LevelId, featureId = feature.FeatureId }, feature);
        }

        // DELETE: api/Games/5/Levels/5/Features/5
        [HttpDelete("{id}/Levels/{levelId}/Features/{featureId}")]
        [Authorize]
        public async Task<IActionResult> DeleteFeature(uint id, uint levelId, uint featureId)
        {
            var level = await _context.Levels.Where(l => l.GameId == id && l.LevelId == levelId).Include(l => l.Features).FirstOrDefaultAsync();

            if (level == null) return NotFound();

            var feature = level.Features.FirstOrDefault(f => f.FeatureId == featureId);

            if (feature == null) return NotFound();

            level.Features.Remove(feature);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Patch a feature
        [HttpPatch("{id}/Levels/{levelId}/Features/{featureId}")]
        [Authorize]
        public async Task<IActionResult> PatchFeature(uint id, uint levelId, uint featureId, [FromBody] JsonPatchDocument<Feature> patchDoc)
        {
            if (patchDoc == null) return BadRequest();

            var feature = await _context.Features.FirstOrDefaultAsync(f => f.FeatureId == featureId && f.LevelId == levelId);

            if (feature == null) return NotFound();

            patchDoc.ApplyTo(feature, ModelState);

            if (!TryValidateModel(feature)) return ValidationProblem(ModelState);

            _context.Entry(feature).Property(f => f.Params).IsModified = true;

            await _context.SaveChangesAsync();

            return Ok(feature);
        }
    }
}
