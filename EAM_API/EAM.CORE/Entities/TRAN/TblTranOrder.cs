using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using EAM.CORE.Common;

namespace EAM.CORE.Entities.TRAN
{
    [Table("EAM_TRAN_ORDER")]
    public class TblTranOrder : SoftDeleteEntity
    {
        [Key]
        [Column("AUFNR")]
        public string Aufnr { get; set; }

        [Column("IWERK")]
        public string? Iwerk { get; set; }

        [Column("AUART")]
        public string? Auart { get; set; }
        [Column("PLNNR")]
        public string? Plnnr { get; set; }

        [Column("KTEXT")]
        public string? Ktext { get; set; }

        [Column("ILART")]
        public string? Ilart { get; set; }

        [Column("ARTPR")]
        public string? Artpr { get; set; }

        [Column("PRIOK")]
        public string? Priok { get; set; }

        [Column("EQUNR")]
        public string? Equnr { get; set; }

        [Column("TPLNR")]
        public string? Tplnr { get; set; }

        [Column("OBLTY")]
        public string? Oblty { get; set; }

        [Column("EQART")]
        public string? Eqart { get; set; }

        [Column("EQART_ERROR")]
        public string? EqartError { get; set; }

        [Column("INGPR")]
        public string? Ingpr { get; set; }

        [Column("WARPL")]
        public string? Warpl { get; set; }

        [Column("ABNUM")]
        public int? Abnum { get; set; }

        [Column("NPLDA")]
        public DateTime? Nplda { get; set; }

        [Column("ADDAT")]
        public DateTime? Addat { get; set; }

        [Column("QMNUM")]
        public string? Qmnum { get; set; }

        [Column("OBKNR")]
        public int? Obknr { get; set; }

        [Column("GEWRK")]
        public string? Gewrk { get; set; }

        [Column("EQART_SUB")]
        public string? EqartSub { get; set; }

        [Column("OBJNR")]
        public string? Objnr { get; set; }

        [Column("AUFPL")]
        public string? Aufpl { get; set; }

        [Column("RSNUM")]
        public string? Rsnum { get; set; }

        [Column("ACC_FLG")]
        public string? AccFlg { get; set; }

        [Column("FTRMS")]
        public DateTime? Ftrms { get; set; }

        [Column("GSTRI")]
        public DateTime? Gstri { get; set; }

        [Column("GLTRI")]
        public DateTime? Gltri { get; set; }

        [Column("GSTRP")]
        public DateTime? Gstrp { get; set; }

        [Column("GLTRP")]
        public DateTime? Gltrp { get; set; }

        [Column("GSTRS")]
        public DateTime? Gstrs { get; set; }

        [Column("GLTRS")]
        public DateTime? Gltrs { get; set; }

        [Column("GETRI")]
        public DateTime? Getri { get; set; }

        [Column("FTRMI")]
        public DateTime? Ftrmi { get; set; }

        [Column("FTRMP")]
        public DateTime? Ftrmp { get; set; }

        [Column("BUKRS")]
        public string? Bukrs { get; set; }

        [Column("ARBPL")]
        public string? Arbpl { get; set; }

        [Column("WERKS")]
        public string? Werks { get; set; }

        [Column("KOSTV")]
        public string? Kostv { get; set; }

        [Column("STORT")]
        public string? Stort { get; set; }

        [Column("IPHAS")]
        public string? Iphas { get; set; }

        [Column("PHAS0")]
        public string? Phas0 { get; set; }

        [Column("PHAS1")]
        public string? Phas1 { get; set; }

        [Column("PHAS2")]
        public string? Phas2 { get; set; }

        [Column("PHAS3")]
        public string? Phas3 { get; set; }

        [Column("PDAT1")]
        public DateTime? Pdat1 { get; set; }

        [Column("PDAT2")]
        public DateTime? Pdat2 { get; set; }

        [Column("PDAT3")]
        public DateTime? Pdat3 { get; set; }

        [Column("IDAT3")]
        public DateTime? Idat3 { get; set; }

        [Column("HT_BTBD")]
        public string? HtBtbd { get; set; }

        [Column("STAFF_PL")]
        public string? StaffPl { get; set; }

        [Column("STAFF")]
        public string? Staff { get; set; }

        [Column("LOAIVT_SD")]
        public string? LoaivtSd { get; set; }

        [Column("STAFF_SC")]
        public string? StaffSc { get; set; }

        [Column("STAFF_KT")]
        public string? StaffKt { get; set; }

        [Column("AUSVN")]
        public DateTime? Ausvn { get; set; }

        [Column("AUSBS")]
        public DateTime? Ausbs { get; set; }

        [Column("LOCK_FLG")]
        public string? LockFlg { get; set; }

        [Column("LOCK_DATE")]
        public DateTime? LockDate { get; set; }

        [Column("DEL_FLG")]
        public string? DelFlg { get; set; }

        [Column("DEL_DATE")]
        public DateTime? DelDate { get; set; }

        [Column("STATUS")]
        public string? Status { get; set; }

        [Column("STAT")]
        public string? Stat { get; set; }

        [Column("STAT_T")]
        public string? StatT { get; set; }

        [Column("LIFNR")]
        public string? Lifnr { get; set; }

        [Column("BUDAT")]
        public DateTime? Budat { get; set; }

        [Column("BLDAT")]
        public DateTime? Bldat { get; set; }

        [Column("HKONT")]
        public string? Hkont { get; set; }

        [Column("DMBTR")]
        public decimal? Dmbtr { get; set; }

        [Column("WAERS")]
        public string? Waers { get; set; }

        [Column("ROOT_F")]
        public string? RootF { get; set; }

        [Column("STAT_MO")]
        public string? StatMo { get; set; }

        [Column("STAT_TD")]
        public string? StatTd { get; set; }

        [Column("STAT_KT")]
        public string? StatKt { get; set; }

        [Column("CF_FLG")]
        public string? CfFlg { get; set; }

        [Column("KQ_FLG")]
        public string? KqFlg { get; set; }

        [Column("GROUPID_PM")]
        public string? GroupidPm { get; set; }

        [Column("PMVTID")]
        public string? Pmvtid { get; set; }

        [Column("ERNAM")]
        public string? Ernam { get; set; }

        [Column("ERDAT")]
        public DateTime? Erdat { get; set; }

        [Column("AENAM")]
        public string? Aenam { get; set; }

        [Column("AEDAT")]
        public DateTime? Aedat { get; set; }

        [Column("NEEDUP")]
        public string? Needup { get; set; }

        [Column("BELNR")]
        public string? Belnr { get; set; }

        [Column("GJAHR")]
        public int? Gjahr { get; set; }
    }
}
