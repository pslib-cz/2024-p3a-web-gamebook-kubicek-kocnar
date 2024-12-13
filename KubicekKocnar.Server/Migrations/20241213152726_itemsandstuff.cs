using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class itemsandstuff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<uint>(
                name: "ItemId",
                table: "Textures",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<uint>(
                name: "State",
                table: "Textures",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.CreateTable(
                name: "Coinages",
                columns: table => new
                {
                    CoinageId = table.Column<uint>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    IconId = table.Column<uint>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Coinages", x => x.CoinageId);
                    table.ForeignKey(
                        name: "FK_Coinages_Textures_IconId",
                        column: x => x.IconId,
                        principalTable: "Textures",
                        principalColumn: "TextureId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "Items",
                columns: table => new
                {
                    ItemId = table.Column<uint>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    Type = table.Column<uint>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Items", x => x.ItemId);
                });

            migrationBuilder.CreateTable(
                name: "PlayerUpgrades",
                columns: table => new
                {
                    PlayerUpgradeId = table.Column<uint>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    IconId = table.Column<uint>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlayerUpgrades", x => x.PlayerUpgradeId);
                    table.ForeignKey(
                        name: "FK_PlayerUpgrades_Textures_IconId",
                        column: x => x.IconId,
                        principalTable: "Textures",
                        principalColumn: "TextureId",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "ItemUpgrades",
                columns: table => new
                {
                    ItemUpgradeId = table.Column<uint>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    inputItemItemId = table.Column<uint>(type: "INTEGER", nullable: false),
                    outputItemItemId = table.Column<uint>(type: "INTEGER", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ItemUpgrades", x => x.ItemUpgradeId);
                    table.ForeignKey(
                        name: "FK_ItemUpgrades_Items_inputItemItemId",
                        column: x => x.inputItemItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ItemUpgrades_Items_outputItemItemId",
                        column: x => x.outputItemItemId,
                        principalTable: "Items",
                        principalColumn: "ItemId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Cost",
                columns: table => new
                {
                    CostId = table.Column<uint>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Count = table.Column<uint>(type: "INTEGER", nullable: false),
                    CoinageId = table.Column<uint>(type: "INTEGER", nullable: false),
                    ItemUpgradeId = table.Column<uint>(type: "INTEGER", nullable: true),
                    PlayerUpgradeId = table.Column<uint>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cost", x => x.CostId);
                    table.ForeignKey(
                        name: "FK_Cost_Coinages_CoinageId",
                        column: x => x.CoinageId,
                        principalTable: "Coinages",
                        principalColumn: "CoinageId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Cost_ItemUpgrades_ItemUpgradeId",
                        column: x => x.ItemUpgradeId,
                        principalTable: "ItemUpgrades",
                        principalColumn: "ItemUpgradeId");
                    table.ForeignKey(
                        name: "FK_Cost_PlayerUpgrades_PlayerUpgradeId",
                        column: x => x.PlayerUpgradeId,
                        principalTable: "PlayerUpgrades",
                        principalColumn: "PlayerUpgradeId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Textures_ItemId",
                table: "Textures",
                column: "ItemId");

            migrationBuilder.CreateIndex(
                name: "IX_Coinages_IconId",
                table: "Coinages",
                column: "IconId");

            migrationBuilder.CreateIndex(
                name: "IX_Cost_CoinageId",
                table: "Cost",
                column: "CoinageId");

            migrationBuilder.CreateIndex(
                name: "IX_Cost_ItemUpgradeId",
                table: "Cost",
                column: "ItemUpgradeId");

            migrationBuilder.CreateIndex(
                name: "IX_Cost_PlayerUpgradeId",
                table: "Cost",
                column: "PlayerUpgradeId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemUpgrades_inputItemItemId",
                table: "ItemUpgrades",
                column: "inputItemItemId");

            migrationBuilder.CreateIndex(
                name: "IX_ItemUpgrades_outputItemItemId",
                table: "ItemUpgrades",
                column: "outputItemItemId");

            migrationBuilder.CreateIndex(
                name: "IX_PlayerUpgrades_IconId",
                table: "PlayerUpgrades",
                column: "IconId");

            migrationBuilder.AddForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures",
                column: "ItemId",
                principalTable: "Items",
                principalColumn: "ItemId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Textures_Items_ItemId",
                table: "Textures");

            migrationBuilder.DropTable(
                name: "Cost");

            migrationBuilder.DropTable(
                name: "Coinages");

            migrationBuilder.DropTable(
                name: "ItemUpgrades");

            migrationBuilder.DropTable(
                name: "PlayerUpgrades");

            migrationBuilder.DropTable(
                name: "Items");

            migrationBuilder.DropIndex(
                name: "IX_Textures_ItemId",
                table: "Textures");

            migrationBuilder.DropColumn(
                name: "ItemId",
                table: "Textures");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Textures");
        }
    }
}
