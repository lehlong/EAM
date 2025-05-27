using AutoMapper;
using Common;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.TRAN;
using EAM.CORE;
using EAM.CORE.Entities.TRAN;
using Microsoft.EntityFrameworkCore;
using NPOI.OpenXmlFormats.Wordprocessing;

namespace EAM.BUSINESS.Services.TRAN
{
    public interface IOrderService : IGenericService<TblTranOrder, OrderDto>
    {
        Task InsertOrder(OrderDto data);
        Task UpdateOrder(OrderDto data);
        Task<OrderDto> GetDetail(string code);
        Task<PagedResponseDto> SearchPlanOrder(BaseFilter filter);
    }

    public class OrderService(AppDbContext dbContext, IMapper mapper) : GenericService<TblTranOrder, OrderDto>(dbContext, mapper), IOrderService
    {
        public override async Task<PagedResponseDto> Search(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrder.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                      x.Ktext.Contains(filter.KeyWord) ||
                                      x.Iwerk.Contains(filter.KeyWord) ||
                                      x.Auart.Contains(filter.KeyWord) ||
                                      x.Qmnum.Contains(filter.KeyWord) ||
                                      x.Equnr.Contains(filter.KeyWord) ||
                                      x.Tplnr.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                query = query.Where(x => string.IsNullOrEmpty(x.Warpl) && !string.IsNullOrEmpty(x.Qmnum));
                return await Paging(query.OrderByDescending(x => x.CreateDate), filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<PagedResponseDto> SearchPlanOrder(BaseFilter filter)
        {
            try
            {
                var query = _dbContext.TblTranOrder.AsQueryable();
                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x => x.Aufnr.Contains(filter.KeyWord) ||
                                      x.Ktext.Contains(filter.KeyWord) ||
                                      x.Iwerk.Contains(filter.KeyWord) ||
                                      x.Auart.Contains(filter.KeyWord) ||
                                      x.Qmnum.Contains(filter.KeyWord) ||
                                      x.Equnr.Contains(filter.KeyWord) ||
                                      x.Tplnr.Contains(filter.KeyWord));
                }
                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }
                query = query.Where(x => !string.IsNullOrEmpty(x.Warpl) && string.IsNullOrEmpty(x.Qmnum));
                return await Paging(query.OrderByDescending(x => x.CreateDate), filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task InsertOrder(OrderDto data)
        {
            try
            {
                var orderType = _dbContext.TblMdOrderType.Find(data.Auart);
                var code = orderType.Sequence + _dbContext.TblTranOrder.Where(x => x.Auart == data.Auart).Count() ?? 0;
                data.Aufnr = code.ToString();
                var entity = _mapper.Map<TblTranOrder>(data);
                _dbContext.TblTranOrder.Add(entity);

                var noti = _dbContext.TblTranNoti.Find(data.Qmnum);
                noti.StatAct = "07";
                noti.Aufnr = code.ToString();
                _dbContext.TblTranNoti.Update(noti);
                var newOrderEq = new TblTranOrderEq
                {
                    Id = Guid.NewGuid().ToString(),
                    Aufnr = data.Aufnr,
                    Equnr = data.Equnr,
                    IsActive = true,
                };
                await _dbContext.TblTranOrderEq.AddAsync(newOrderEq);

                await _dbContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

        public async Task UpdateOrder(OrderDto data)
        {
            try
            {
                var entity = _mapper.Map<TblTranOrder>(data);
                _dbContext.TblTranOrder.Update(entity);
                if (!string.IsNullOrEmpty(data.Qmnum))
                {
                    if(data.Status == "07" || data.Status == "04")
                    {
                        var noti = _dbContext.TblTranNoti.Find(data.Qmnum);
                        noti.StatAct = data.Status;
                        _dbContext.TblTranNoti.Update(noti);
                    }
                }


                if (data.lstCatalog != null)
                {
                    foreach (var i in data.lstCatalog)
                    {
                        if (i.Id == "A")
                        {
                            i.Id = Guid.NewGuid().ToString();
                            _dbContext.TblTranNotiCatalog.Add(i);
                        }
                        else
                        {
                            _dbContext.TblTranNotiCatalog.Update(i);
                        }
                    }
                }
                if (data.lstVt != null)
                {
                    foreach (var i in data.lstVt)
                    {
                        if (i.Id == "A")
                        {
                            i.Id = Guid.NewGuid().ToString();
                            _dbContext.TblTranOrderVt.Add(i);
                        }
                        else
                        {
                            _dbContext.TblTranOrderVt.Update(i);
                        }
                    }
                }
                if (data.lstEquip != null)
                {
                    foreach(var e in data.lstEquip)
                    {
                        var equip = _dbContext.TblMdEquip.Find(e.Equnr);
                        equip.StatAct = e.Status;
                        equip.StatusTh = e.StatusTb;
                    }
                    _dbContext.TblTranOrderEq.UpdateRange(data.lstEquip);
                }

                if (data.lstOpe != null)
                {
                    _dbContext.TblTranOrderOperation.UpdateRange(data.lstOpe);
                }

                await _dbContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }

        public async Task<OrderDto> GetDetail(string code)
        {
            try
            {
                var entity = _dbContext.TblTranOrder.Find(code);
                var dto = _mapper.Map<OrderDto>(entity);
                dto.lstCatalog = await _dbContext.TblTranNotiCatalog.Where(x => x.Qmnum == dto.Qmnum).ToListAsync();
                dto.lstEquip = await _dbContext.TblTranOrderEq.Where(x => x.Aufnr == dto.Aufnr).ToListAsync();
                dto.lstVt = await _dbContext.TblTranOrderVt.Where(x => x.Aufnr == dto.Aufnr).ToListAsync();
                dto.lstOpe = await _dbContext.TblTranOrderOperation.Where(x => x.Aufnr == dto.Aufnr).ToListAsync();
                return dto;
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return new OrderDto();
            }
        }
    }
}