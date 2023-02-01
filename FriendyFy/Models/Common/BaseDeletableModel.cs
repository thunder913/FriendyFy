using System;

namespace FriendyFy.Models.Common;

public class BaseDeletableModel<TKey> : BaseModel<TKey>, IDeletableEntity
{
    public bool IsDeleted { get; set; }

    public DateTime? DeletedOn { get; set; }
}