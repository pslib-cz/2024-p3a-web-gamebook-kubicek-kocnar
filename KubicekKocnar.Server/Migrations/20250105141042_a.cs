using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class a : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemUpgrades_Items_inputItemItemId",
                table: "ItemUpgrades");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemUpgrades_Items_outputItemItemId",
                table: "ItemUpgrades");

            migrationBuilder.RenameColumn(
                name: "outputItemItemId",
                table: "ItemUpgrades",
                newName: "OutputItemId");

            migrationBuilder.RenameColumn(
                name: "inputItemItemId",
                table: "ItemUpgrades",
                newName: "InputItemId");

            migrationBuilder.RenameIndex(
                name: "IX_ItemUpgrades_outputItemItemId",
                table: "ItemUpgrades",
                newName: "IX_ItemUpgrades_OutputItemId");

            migrationBuilder.RenameIndex(
                name: "IX_ItemUpgrades_inputItemItemId",
                table: "ItemUpgrades",
                newName: "IX_ItemUpgrades_InputItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemUpgrades_Items_InputItemId",
                table: "ItemUpgrades",
                column: "InputItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemUpgrades_Items_OutputItemId",
                table: "ItemUpgrades",
                column: "OutputItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ItemUpgrades_Items_InputItemId",
                table: "ItemUpgrades");

            migrationBuilder.DropForeignKey(
                name: "FK_ItemUpgrades_Items_OutputItemId",
                table: "ItemUpgrades");

            migrationBuilder.RenameColumn(
                name: "OutputItemId",
                table: "ItemUpgrades",
                newName: "outputItemItemId");

            migrationBuilder.RenameColumn(
                name: "InputItemId",
                table: "ItemUpgrades",
                newName: "inputItemItemId");

            migrationBuilder.RenameIndex(
                name: "IX_ItemUpgrades_OutputItemId",
                table: "ItemUpgrades",
                newName: "IX_ItemUpgrades_outputItemItemId");

            migrationBuilder.RenameIndex(
                name: "IX_ItemUpgrades_InputItemId",
                table: "ItemUpgrades",
                newName: "IX_ItemUpgrades_inputItemItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_ItemUpgrades_Items_inputItemItemId",
                table: "ItemUpgrades",
                column: "inputItemItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ItemUpgrades_Items_outputItemItemId",
                table: "ItemUpgrades",
                column: "outputItemItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
