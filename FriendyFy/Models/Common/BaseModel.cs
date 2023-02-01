using System;
using System.ComponentModel.DataAnnotations;

namespace FriendyFy.Models.Common;

public abstract class BaseModel<TKey> : IAuditInfo
{
    [Key]
    public TKey Id { get; set; }

    public DateTime CreatedOn { get; set; } = DateTime.Now;

    public DateTime? ModifiedOn { get; set; }
}