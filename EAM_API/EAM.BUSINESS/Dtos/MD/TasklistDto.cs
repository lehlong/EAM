using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.MD
{
    public class TasklistDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string Id { get; set; } = null!;
        public string? Plnnr { get; set; }
        public string? Iwerks { get; set; }
        public string? Ktext { get; set; }
        public string? Vornr { get; set; }
        public int? VornrSub { get; set; }
        public string? Ltxa1 { get; set; }
        public decimal? Duration { get; set; }
        public string? TimeUnit { get; set; }
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }
        
        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblMdTasklist, TasklistDto>().ReverseMap();
        }
    }
} 