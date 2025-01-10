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
    public class ItemUpgradesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ItemUpgradesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/ItemUpgrades
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ItemUpgrade>>> GetItemUpgrades()
        {
            return await _context.ItemUpgrades.Include(i => i.InputItem).Include(i => i.OutputItem).ToListAsync();
        }

        // GET: api/ItemUpgrades/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ItemUpgrade>> GetItemUpgrade(uint id)
        {
            var itemUpgrade = await _context.ItemUpgrades.FindAsync(id);

            if (itemUpgrade == null)
            {
                return NotFound();
            }

            return itemUpgrade;
        }

        // PUT: api/ItemUpgrades/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutItemUpgrade(uint id, ItemUpgrade itemUpgrade)
        {
            if (id != itemUpgrade.ItemUpgradeId)
            {
                return BadRequest();
            }

            _context.Entry(itemUpgrade).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ItemUpgradeExists(id))
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

        // POST: api/ItemUpgrades
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<ItemUpgrade>> PostItemUpgrade(ItemUpgrade itemUpgrade)
        {
            if (!_context.Items.Any(i => i.ItemId == itemUpgrade.InputItemId))
            {
                return BadRequest("Input item does not exist");
            }

            if (!_context.Items.Any(i => i.ItemId == itemUpgrade.OutputItemId))
            {
                return BadRequest("Output item does not exist");
            }

            _context.ItemUpgrades.Add(itemUpgrade);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetItemUpgrade", new { id = itemUpgrade.ItemUpgradeId }, itemUpgrade);
        }

        // DELETE: api/ItemUpgrades/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteItemUpgrade(uint id)
        {
            var itemUpgrade = await _context.ItemUpgrades.FindAsync(id);
            if (itemUpgrade == null)
            {
                return NotFound();
            }

            _context.ItemUpgrades.Remove(itemUpgrade);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ItemUpgradeExists(uint id)
        {
            return _context.ItemUpgrades.Any(e => e.ItemUpgradeId == id);
        }
    }
}
