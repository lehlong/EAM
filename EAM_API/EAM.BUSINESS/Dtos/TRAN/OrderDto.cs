using AutoMapper;
using Common;
using EAM.CORE.Entities.TRAN;
using System;
using System.ComponentModel.DataAnnotations;

namespace EAM.BUSINESS.Dtos.TRAN
{
    public class OrderDto : BaseMdDto, IMapFrom, IDto
    {
        [Key]
        public string? Aufnr { get; set; }
        public string? Iwerk { get; set; }
        public string? Auart { get; set; }
        public string? Ktext { get; set; }
        public string? Ilart { get; set; }
        public string? Artpr { get; set; }
        public string? Priok { get; set; }
        public string? Equnr { get; set; }
        public string? Tplnr { get; set; }
        public string? Oblty { get; set; }
        public string? Eqart { get; set; }
        public string? EqartError { get; set; }
        public string? Ingpr { get; set; }
        public string? Warpl { get; set; }
        public int? Abnum { get; set; }
        public DateTime? Nplda { get; set; }
        public DateTime? Addat { get; set; }
        public string? Qmnum { get; set; }
        public int? Obknr { get; set; }
        public string? Gewrk { get; set; }
        public string? EqartSub { get; set; }
        public string? Objnr { get; set; }
        public string? Aufpl { get; set; }
        public string? Rsnum { get; set; }
        public string? AccFlg { get; set; }
        public DateTime? Ftrms { get; set; }
        public DateTime? Gstri { get; set; }
        public DateTime? Gltri { get; set; }
        public DateTime? Gstrp { get; set; }
        public DateTime? Gltrp { get; set; }
        public DateTime? Gstrs { get; set; }
        public DateTime? Gltrs { get; set; }
        public DateTime? Getri { get; set; }
        public DateTime? Ftrmi { get; set; }
        public DateTime? Ftrmp { get; set; }
        public string? Bukrs { get; set; }
        public string? Arbpl { get; set; }
        public string? Werks { get; set; }
        public string? Kostv { get; set; }
        public string? Stort { get; set; }
        public string? Iphas { get; set; }
        public string? Phas0 { get; set; }
        public string? Phas1 { get; set; }
        public string? Phas2 { get; set; }
        public string? Phas3 { get; set; }
        public DateTime? Pdat1 { get; set; }
        public DateTime? Pdat2 { get; set; }
        public DateTime? Pdat3 { get; set; }
        public DateTime? Idat3 { get; set; }
        public string? HtBtbd { get; set; }
        public string? StaffPl { get; set; }
        public string? Staff { get; set; }
        public string? LoaivtSd { get; set; }
        public string? StaffSc { get; set; }
        public string? StaffKt { get; set; }
        public DateTime? Ausvn { get; set; }
        public DateTime? Ausbs { get; set; }
        public string? LockFlg { get; set; }
        public DateTime? LockDate { get; set; }
        public string? DelFlg { get; set; }
        public DateTime? DelDate { get; set; }
        public string? Status { get; set; }
        public string? Stat { get; set; }
        public string? StatT { get; set; }
        public string? Lifnr { get; set; }
        public DateTime? Budat { get; set; }
        public DateTime? Bldat { get; set; }
        public string? Hkont { get; set; }
        public decimal? Dmbtr { get; set; }
        public string? Waers { get; set; }
        public string? RootF { get; set; }
        public string? StatMo { get; set; }
        public string? StatTd { get; set; }
        public string? StatKt { get; set; }
        public string? CfFlg { get; set; }
        public string? KqFlg { get; set; }
        public string? GroupIdPm { get; set; }
        public string? Pmvtid { get; set; }
        public string? Ernam { get; set; }
        public DateTime? Erdat { get; set; }
        public string? Aenam { get; set; }
        public DateTime? Aedat { get; set; }
        public string? Needup { get; set; }
        public string? Belnr { get; set; }
        public string? Gjahr { get; set; }
        public List<TblTranNotiCatalog>? lstCatalog { get; set; }
        public List<TblTranOrderVt>? lstVt { get; set; }
        public List<TblTranOrderEq>? lstEquip { get; set; }
        public string? State { get => this.IsActive == true ? "Đang hoạt động" : "Khóa"; }

        public void Mapping(Profile profile)
        {
            profile.CreateMap<TblTranOrder, OrderDto>().ReverseMap();
        }
    }
}