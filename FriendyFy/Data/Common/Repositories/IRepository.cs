﻿using System;
using System.Linq;
using System.Threading.Tasks;

namespace FriendyFy.Data;

public interface IRepository<TEntity> : IDisposable
    where TEntity : class
{
    IQueryable<TEntity> All();

    IQueryable<TEntity> AllAsNoTracking();

    void Add(TEntity entity);

    void Update(TEntity entity);

    void Delete(TEntity entity);

    Task<int> SaveChangesAsync();
}