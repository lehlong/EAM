﻿using Microsoft.EntityFrameworkCore;
using EAM.BUSINESS.Common;
using EAM.BUSINESS.Dtos.AD;
using EAM.BUSINESS.Filter.AD;
using EAM.CORE;
using EAM.CORE.Entities.AD;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;
using EAM.BUSINESS.Services.HUB;
using Common;
using Common.Util;
using EAM.BUSINESS.Common.Enum;
using Org.BouncyCastle.Tsp;

namespace EAM.BUSINESS.Services.AD
{
    public interface IAccountService : IGenericService<TblAdAccount, AccountDto>
    {
        Task<PagedResponseDto> Search(AccountFilter filter);
        Task UpdateInformation(AccountUpdateInformationDto dto);
        Task<IList<AccountDto>> GetAll(AccountFilterLite filter);
        Task<AccountTreeRightDto> GetByIdWithRightTree(object id);
        void ResetPassword(string username);
    }

    public class AccountService(AppDbContext dbContext, IMapper mapper, IHubContext<RefreshServiceHub> hubContext) : GenericService<TblAdAccount, AccountDto>(dbContext, mapper), IAccountService
    {
        private readonly IHubContext<RefreshServiceHub> _hubContext = hubContext;

        public async Task<PagedResponseDto> Search(AccountFilter filter)
        {
            try
            {
                var query = _dbContext.TblAdAccount
                .Include(x => x.Account_AccountGroups)
                .ThenInclude(x => x.AccountGroup)
               // .Include(x => x.OrganizeCode)
                .AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x =>
                        x.UserName.Contains(filter.KeyWord) ||
                        x.FullName.Contains(filter.KeyWord)
                    );
                }

                if (!string.IsNullOrWhiteSpace(filter.RoleCode))
                {
                    query = query.Where(x => x.Account_AccountGroups.Select(x => x.AccountGroup).Any(x => x.RoleCode == filter.RoleCode));
                }

                if (!string.IsNullOrWhiteSpace(filter.AccountType))
                {
                    query = query.Where(x => x.AccountType == filter.AccountType);
                }

                //if (!string.IsNullOrWhiteSpace(filter.OrganizeCode))
                //{
                //    query = query.Where(x => x.OrganizeCode == filter.OrganizeCode);
                //}

                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }

                  if (filter.GroupId.HasValue)
                {
                    query = query.Where(x => x.Account_AccountGroups.Any(x => x.GroupId == filter.GroupId));
                }

                return await Paging(query, filter);
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<IList<AccountDto>> GetAll(AccountFilterLite filter)
        {
            if (filter == null)
            {
                Status = false;
                MessageObject.Code = "0000";
                return null;
            }
            try
            {
                var query = _dbContext.TblAdAccount
                    .Include(x => x.Account_AccountGroups)
                    .ThenInclude(x => x.AccountGroup)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(filter.KeyWord))
                {
                    query = query.Where(x =>
                        x.UserName.Contains(filter.KeyWord) ||
                        x.FullName.Contains(filter.KeyWord)
                    );
                }

                if (!string.IsNullOrWhiteSpace(filter.AccountType))
                {
                    query = query.Where(x => x.AccountType == filter.AccountType);
                }

                if (!string.IsNullOrWhiteSpace(filter.RoleCode))
                {
                    query = query.Where(x => x.Account_AccountGroups.Select(x => x.AccountGroup).Any(x => x.RoleCode == filter.RoleCode));
                }

                if (filter.IsActive.HasValue)
                {
                    query = query.Where(x => x.IsActive == filter.IsActive);
                }

                if (filter.GroupId.HasValue)
                {
                    query = query.Where(x => x.Account_AccountGroups.Any(x => x.GroupId == filter.GroupId));
                }

                if ((filter?.ExceptRoles?.Length ?? 0) > 0)
                {
                    query = query.Where(x => x.Account_AccountGroups.Select(x => x.AccountGroup)
                                    .Any(x => !filter.ExceptRoles.Any(y => y == x.RoleCode)));
                }

                query = query.OrderByDescending(x => x.CreateDate);
                return _mapper.Map<IList<AccountDto>>(await query.ToListAsync());
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
                return null;
            }
        }

        public async Task<AccountTreeRightDto> GetByIdWithRightTree(object Id)
        {
            var data = await _dbContext.TblAdAccount
                                        .Include(x => x.Account_AccountGroups)
                                        .ThenInclude(x => x.AccountGroup)
                                        .ThenInclude(x => x.ListAccountGroupRight)
                                        .Include(x => x.AccountRights)
                                        .ThenInclude(x => x.Right)
                                       // .Include(x=>x.Partner)
                                        .FirstOrDefaultAsync(x => x.UserName == Id as string);


            // Lấy danh sách tất cả các quyền
            var lstNode = new List<RightDto>();
            var rootNode = new RightDto() { Id = "R", PId = "-R", Name = "Danh sách quyền trong hệ thống" };
            lstNode.Add(rootNode);

            var lstAllRight = await _dbContext.TblAdRight.Where(x => x.Id != "R").OrderBy(x => x.OrderNumber).ToListAsync();

            var lstRightInGroup = data.Account_AccountGroups
                    .Select(x => x.AccountGroup)
                    .SelectMany(x => x.ListAccountGroupRight)
                    .Select(x => x.RightId)
                    .Where(x => x != "R")
                    .ToList();

            var lstRightOutGroup = data.AccountRights;

            if (data.Account_AccountGroups.Count > 0)
            {
                rootNode.IsChecked = true;
            }
            foreach (var right in lstAllRight)
            {
                var node = new RightDto() { Id = right.Id, Name = right.Name, PId = right.PId };
                if (lstRightOutGroup.Where(x => x.IsAdded.HasValue && x.IsAdded.Value).Select(x => x.RightId).Contains(right.Id))
                {
                    node.IsChecked = true;
                }
                else if (lstRightInGroup.Contains(right.Id) && !lstRightOutGroup.Where(x => x.IsRemoved.HasValue && x.IsRemoved.Value).Select(x => x.RightId).Contains(right.Id))
                {
                    node.IsChecked = true;
                }
                lstNode.Add(node);
            }

            var nodeDict = lstNode.ToDictionary(n => n.Id);
            foreach (var item in lstNode)
            {
                if (item.PId == "-R" || !nodeDict.TryGetValue(item.PId, out RightDto parentNode))
                {
                    continue;
                }

                parentNode.Children ??= [];
                parentNode.Children.Add(item);
            }

            var result = _mapper.Map<AccountTreeRightDto>(data);
            result.TreeRight = rootNode;

            return result;
        }

        public override async Task<AccountDto> Add(IDto dto)
        {
            var realDto = dto as AccountCreateDto;
            if (string.IsNullOrEmpty(realDto.Password))
            {
                realDto.Password = Utils.CryptographyMD5($"{realDto.UserName}@123");
            }
            else
            {
                realDto.Password = Utils.CryptographyMD5(realDto.Password);
            }
            if (realDto.ImageBase64 != null && realDto.ImageBase64 != "")
            {
                realDto.UrlImage = SaveBase64ToFile(realDto.ImageBase64);
            }
            var data = await base.Add(dto);
            return data;
        }

        public async Task UpdateInformation(AccountUpdateInformationDto dto)
        {
            await base.Update(dto);
            if (Status)
            {
                var groups = await _dbContext.TblAdAccountGroup.Where(x =>
                    x.RoleCode == Roles.PHONG_KINH_DOANH.ToString() ||
                    x.RoleCode == Roles.BAN_GIAM_DOC.ToString() ||
                    x.RoleCode == Roles.BAN_DIEU_HANH.ToString())
                .Select(x => x.Id.ToString().ToLower()).ToListAsync();
            }
            await _hubContext.Clients.All.SendAsync(SignalRMethod.USER.ToString());
        }

        public string SaveBase64ToFile(string base64String)
        {
            try
            {
                if (base64String.Contains(","))
                {
                    base64String = base64String.Split(',')[1];
                }
                byte[] fileBytes = Convert.FromBase64String(base64String);
                string rootPath = "Uploads/Images";
                string datePath = $"{DateTime.Now:yyyy/MM/dd}";
                string fullPath = Path.Combine(rootPath, datePath);
                if (!Directory.Exists(fullPath))
                {
                    Directory.CreateDirectory(fullPath);
                }
                string fileName = $"{Guid.NewGuid()}.jpg";
                string filePath = Path.Combine(fullPath, fileName);
                File.WriteAllBytes(filePath, fileBytes);
                return Path.Combine("/Uploads/Images", datePath, fileName).Replace("\\", "/");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Lỗi: {ex.Message}");
                return null;
            }
        }

        public override async Task Update(IDto dto)
        {
            try
            {
                var dt = dto as AccountUpdateDto;
                if (dt.ImageBase64 != null && dt.ImageBase64 != "")
                {
                    dt.UrlImage = SaveBase64ToFile(dt.ImageBase64);
                }
                var model = _mapper.Map<AccountDto>(dto as AccountUpdateDto);

                var rootRightInModel = model?.AccountRights?.Where(x => x.RightId == "R").ToList();

                if (rootRightInModel != null && rootRightInModel.Count != 0)
                {
                    rootRightInModel.ForEach(x =>
                    {
                        model.AccountRights.Remove(x);
                    });
                }

                var accountLite = _mapper.Map<AccountLiteDto>(model);

                var currentObj = await _dbContext.TblAdAccount.Include(x => x.Account_AccountGroups)
                    .ThenInclude(x => x.AccountGroup)
                    .ThenInclude(x => x.ListAccountGroupRight)
                    .Include(x => x.AccountRights).FirstOrDefaultAsync(x => x.UserName == model.UserName);


                var listRightInGroups = currentObj.Account_AccountGroups
                    .Select(x => x.AccountGroup)
                    .SelectMany(x => x.ListAccountGroupRight)
                    .Select(x => x.RightId)
                    .Where(x => x != "R")
                    .ToList(); // list right in current Group of user

                var listRightOutGroup = currentObj.AccountRights.Select(x => x.RightId).ToList();

                _mapper.Map(accountLite, currentObj);

                currentObj.AccountRights ??= new List<TblAdAccountRight>();

                foreach (var item in model.AccountRights)
                {
                    var rightInAccountRight = currentObj.AccountRights.FirstOrDefault(x => x.RightId == item.RightId);

                    if (listRightInGroups.Contains(item.RightId))
                    {
                        if (rightInAccountRight != null)
                        {
                            currentObj.AccountRights.Remove(rightInAccountRight);
                        }
                        else continue;
                    }


                    if (rightInAccountRight != null)
                    {
                        if (rightInAccountRight.IsRemoved.HasValue && rightInAccountRight.IsRemoved.Value)
                        {
                            rightInAccountRight.IsAdded = true;
                            rightInAccountRight.IsRemoved = false;
                        }
                        else continue;
                    }
                    else
                    {
                        currentObj.AccountRights.Add(new TblAdAccountRight()
                        {
                            RightId = item.RightId,
                            IsAdded = true,
                            IsRemoved = false
                        });
                    }
                }

                var listRightInGroupRemove = listRightInGroups.Concat(listRightOutGroup).Where(x => !model.AccountRights.Select(x => x.RightId).Contains(x)).ToList();

                foreach (var item in listRightInGroupRemove)
                {
                    if (listRightInGroups.Contains(item))
                    {
                        var rightInAccountRight = currentObj.AccountRights.FirstOrDefault(x => x.RightId == item);

                        if (rightInAccountRight == null)
                        {
                            currentObj.AccountRights.Add(new TblAdAccountRight()
                            {
                                RightId = item,
                                IsAdded = false,
                                IsRemoved = true
                            });
                        }
                        else
                        {
                            if (rightInAccountRight.IsAdded.HasValue && rightInAccountRight.IsAdded.Value)
                            {
                                rightInAccountRight.IsAdded = false;
                                rightInAccountRight.IsRemoved = true;
                            }
                            else continue;
                        }
                    }
                    else
                    {
                        var rightInAccountRight = currentObj.AccountRights.FirstOrDefault(x => x.RightId == item);
                        if (rightInAccountRight != null)
                        {
                            currentObj.AccountRights.Remove(rightInAccountRight);
                        }
                    }
                }
                await _dbContext.SaveChangesAsync();
                if (this.Status)
                {
                    await _hubContext.Clients.Groups(currentObj.UserName).SendAsync(SignalRMethod.RIGHT.ToString(), currentObj.UserName);
                }
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }
        public void ResetPassword(string username)
        {
            try
            {
                var user = _dbContext.TblAdAccount.Find(username);
                user.Password = Utils.CryptographyMD5($"{username}@123");
                _dbContext.TblAdAccount.Update(user);
                _dbContext.SaveChanges();
            }
            catch (Exception ex)
            {
                Status = false;
                Exception = ex;
            }
        }
    }
}
