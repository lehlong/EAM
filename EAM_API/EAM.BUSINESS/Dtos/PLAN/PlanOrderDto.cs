using AutoMapper;
using Common;
using EAM.CORE.Entities.PLAN;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.PLAN
{
    public class PlanOrderDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }

        [Key]
        public string Id { get; set; }
        public string? Iwerk { get; set; }
        public string? Warpl { get; set; }
        public string? Equnr { get; set; }
        public string? Tplnr { get; set; }
        public string? Cyctype { get; set; }
        public string? Cycunit { get; set; }
        public int? Cycle { get; set; }
        public string? Measure { get; set; }
        public decimal? Measvalue { get; set; }
        public string? Aufnr { get; set; }
        public DateTime? Schstart { get; set; }
        public DateTime? Schend { get; set; }
        public bool? Iscompled { get; set; }

        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }

        [Description("Hoàn thành")]
        public string CompletionStatus { get => this.Iscompled == true ? "Đã hoàn thành" : "Chưa hoàn thành"; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblPlanOrder, PlanOrderDto>().ReverseMap();
        }
    }
} 