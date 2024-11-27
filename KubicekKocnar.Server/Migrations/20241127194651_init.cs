using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KubicekKocnar.Server.Migrations
{
    /// <inheritdoc />
    public partial class init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Features",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    X = table.Column<int>(type: "INTEGER", nullable: false),
                    Y = table.Column<int>(type: "INTEGER", nullable: false),
                    Z = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Features", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Levels",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Description = table.Column<string>(type: "TEXT", nullable: true),
                    NextLevelId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Levels", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Levels_Levels_NextLevelId",
                        column: x => x.NextLevelId,
                        principalTable: "Levels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Textures",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    src = table.Column<byte[]>(type: "BLOB", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Textures", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FeatureParams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Key = table.Column<string>(type: "TEXT", nullable: false),
                    Value = table.Column<string>(type: "TEXT", nullable: false),
                    FeatureId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeatureParams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FeatureParams_Features_FeatureId",
                        column: x => x.FeatureId,
                        principalTable: "Features",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Lights",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    X = table.Column<int>(type: "INTEGER", nullable: false),
                    Y = table.Column<int>(type: "INTEGER", nullable: false),
                    Z = table.Column<int>(type: "INTEGER", nullable: false),
                    color = table.Column<string>(type: "TEXT", nullable: false),
                    intensity = table.Column<float>(type: "REAL", nullable: false),
                    LevelId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lights", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lights_Levels_LevelId",
                        column: x => x.LevelId,
                        principalTable: "Levels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Blocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    texture0Id = table.Column<int>(type: "INTEGER", nullable: false),
                    texture1Id = table.Column<int>(type: "INTEGER", nullable: false),
                    texture2Id = table.Column<int>(type: "INTEGER", nullable: false),
                    texture3Id = table.Column<int>(type: "INTEGER", nullable: false),
                    texture4Id = table.Column<int>(type: "INTEGER", nullable: false),
                    texture5Id = table.Column<int>(type: "INTEGER", nullable: false),
                    attributes = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Blocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Blocks_Textures_texture0Id",
                        column: x => x.texture0Id,
                        principalTable: "Textures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Blocks_Textures_texture1Id",
                        column: x => x.texture1Id,
                        principalTable: "Textures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Blocks_Textures_texture2Id",
                        column: x => x.texture2Id,
                        principalTable: "Textures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Blocks_Textures_texture3Id",
                        column: x => x.texture3Id,
                        principalTable: "Textures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Blocks_Textures_texture4Id",
                        column: x => x.texture4Id,
                        principalTable: "Textures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Blocks_Textures_texture5Id",
                        column: x => x.texture5Id,
                        principalTable: "Textures",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PlacedBlocks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    BlockId = table.Column<int>(type: "INTEGER", nullable: false),
                    X = table.Column<int>(type: "INTEGER", nullable: false),
                    Y = table.Column<int>(type: "INTEGER", nullable: false),
                    Z = table.Column<int>(type: "INTEGER", nullable: false),
                    LevelId = table.Column<int>(type: "INTEGER", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlacedBlocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlacedBlocks_Blocks_BlockId",
                        column: x => x.BlockId,
                        principalTable: "Blocks",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PlacedBlocks_Levels_LevelId",
                        column: x => x.LevelId,
                        principalTable: "Levels",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_texture0Id",
                table: "Blocks",
                column: "texture0Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_texture1Id",
                table: "Blocks",
                column: "texture1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_texture2Id",
                table: "Blocks",
                column: "texture2Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_texture3Id",
                table: "Blocks",
                column: "texture3Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_texture4Id",
                table: "Blocks",
                column: "texture4Id");

            migrationBuilder.CreateIndex(
                name: "IX_Blocks_texture5Id",
                table: "Blocks",
                column: "texture5Id");

            migrationBuilder.CreateIndex(
                name: "IX_FeatureParams_FeatureId",
                table: "FeatureParams",
                column: "FeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_Levels_NextLevelId",
                table: "Levels",
                column: "NextLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Lights_LevelId",
                table: "Lights",
                column: "LevelId");

            migrationBuilder.CreateIndex(
                name: "IX_PlacedBlocks_BlockId",
                table: "PlacedBlocks",
                column: "BlockId");

            migrationBuilder.CreateIndex(
                name: "IX_PlacedBlocks_LevelId",
                table: "PlacedBlocks",
                column: "LevelId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FeatureParams");

            migrationBuilder.DropTable(
                name: "Lights");

            migrationBuilder.DropTable(
                name: "PlacedBlocks");

            migrationBuilder.DropTable(
                name: "Features");

            migrationBuilder.DropTable(
                name: "Blocks");

            migrationBuilder.DropTable(
                name: "Levels");

            migrationBuilder.DropTable(
                name: "Textures");
        }
    }
}
