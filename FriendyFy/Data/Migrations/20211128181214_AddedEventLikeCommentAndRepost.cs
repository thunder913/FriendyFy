using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FriendyFy.Data.Migrations
{
    public partial class AddedEventLikeCommentAndRepost : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PostComment_Events_EventId",
                table: "PostComment");

            migrationBuilder.DropForeignKey(
                name: "FK_PostLike_Events_EventId",
                table: "PostLike");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Events_EventId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_Posts_EventId",
                table: "Posts");

            migrationBuilder.DropIndex(
                name: "IX_PostLike_EventId",
                table: "PostLike");

            migrationBuilder.DropIndex(
                name: "IX_PostComment_EventId",
                table: "PostComment");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "Posts");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "PostLike");

            migrationBuilder.DropColumn(
                name: "EventId",
                table: "PostComment");

            migrationBuilder.AddColumn<string>(
                name: "EventCommentId",
                table: "CommentLike",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "EventComment",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CommentedById = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EventId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventComment", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventComment_AspNetUsers_CommentedById",
                        column: x => x.CommentedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EventComment_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventLike",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    LikedById = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EventId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventLike", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventLike_AspNetUsers_LikedById",
                        column: x => x.LikedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EventLike_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EventRepost",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    EventId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ModifiedOn = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EventRepost", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EventRepost_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EventRepost_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CommentLike_EventCommentId",
                table: "CommentLike",
                column: "EventCommentId");

            migrationBuilder.CreateIndex(
                name: "IX_EventComment_CommentedById",
                table: "EventComment",
                column: "CommentedById");

            migrationBuilder.CreateIndex(
                name: "IX_EventComment_EventId",
                table: "EventComment",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventLike_EventId",
                table: "EventLike",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventLike_LikedById",
                table: "EventLike",
                column: "LikedById");

            migrationBuilder.CreateIndex(
                name: "IX_EventRepost_EventId",
                table: "EventRepost",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_EventRepost_UserId",
                table: "EventRepost",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_CommentLike_EventComment_EventCommentId",
                table: "CommentLike",
                column: "EventCommentId",
                principalTable: "EventComment",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CommentLike_EventComment_EventCommentId",
                table: "CommentLike");

            migrationBuilder.DropTable(
                name: "EventComment");

            migrationBuilder.DropTable(
                name: "EventLike");

            migrationBuilder.DropTable(
                name: "EventRepost");

            migrationBuilder.DropIndex(
                name: "IX_CommentLike_EventCommentId",
                table: "CommentLike");

            migrationBuilder.DropColumn(
                name: "EventCommentId",
                table: "CommentLike");

            migrationBuilder.AddColumn<string>(
                name: "EventId",
                table: "Posts",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventId",
                table: "PostLike",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventId",
                table: "PostComment",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Posts_EventId",
                table: "Posts",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLike_EventId",
                table: "PostLike",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_PostComment_EventId",
                table: "PostComment",
                column: "EventId");

            migrationBuilder.AddForeignKey(
                name: "FK_PostComment_Events_EventId",
                table: "PostComment",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PostLike_Events_EventId",
                table: "PostLike",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Events_EventId",
                table: "Posts",
                column: "EventId",
                principalTable: "Events",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
