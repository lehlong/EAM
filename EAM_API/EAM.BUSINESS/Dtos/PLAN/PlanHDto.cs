using AutoMapper;
using Common;
using EAM.CORE.Entities.MD;
using EAM.CORE.Entities.PLAN;
using System;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace EAM.BUSINESS.Dtos.PLAN
{
    public class PlanHDto : BaseMdDto, IMapFrom, IDto
    {
        [JsonIgnore]
        [Description("STT")]
        public int OrdinalNumber { get; set; }

        [Key]
        public string Warpl { get; set; }
        public string? Iwerk { get; set; }
        public string? Wptxt { get; set; }
        public string? Mptyp { get; set; }
        public string? Mpgrp { get; set; }
        public string? Cyctype { get; set; }
        public string? Cycunit { get; set; }
        public decimal? Cycle { get; set; }
        public decimal? Cycef { get; set; }
        public DateTime? Stdate { get; set; }
        public string? Measure { get; set; }
        public decimal? Measvalue { get; set; }
        public string? Mix { get; set; }
        public string? Tplnr { get; set; }
        public string? Equnr { get; set; }
        public string? Plnnr { get; set; }
        public string? Ingrp { get; set; }
        public string? Arbpl { get; set; }
        public string? Auart { get; set; }
        [Description("Trạng thái")]
        public string State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblPlanH, PlanHDto>().ReverseMap();
        }
    }
}