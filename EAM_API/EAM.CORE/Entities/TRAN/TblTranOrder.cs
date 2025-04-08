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
        [MaxLength(12)]
        public string Aufnr { get; set; } = null!;

        [Column("IWERK")]
        [MaxLength(4)]
        public string? Iwerk { get; set; }

        [Column("AUART")]
        [MaxLength(4)]
        public string? Auart { get; set; }

        [Column("KTEXT")]
        [MaxLength(40)]
        public string? Ktext { get; set; }

        [Column("ILART")]
        [MaxLength(3)]
        public string? Ilart { get; set; }

        [Column("ARTPR")]
        [MaxLength(2)]
        public string? Artpr { get; set; }

        [Column("PRIOK")]
        [MaxLength(1)]
        public string? Priok { get; set; }

        [Column("EQUNR")]
        [MaxLength(18)]
        public string? Equnr { get; set; }

        [Column("TPLNR")]
        [MaxLength(30)]
        public string? Tplnr { get; set; }

        [Column("OBLTY")]
        [MaxLength(2)]
        public string? Oblty { get; set; }

        [Column("EQART")]
        [MaxLength(10)]
        public string? Eqart { get; set; }

        [Column("EQART_ERROR")]
        [MaxLength(1)]
        public string? EqartError { get; set; }

        [Column("INGPR")]
        [MaxLength(3)]
        public string? Ingpr { get; set; }

        [Column("WARPL")]
        [MaxLength(12)]
        public string? Warpl { get; set; }

        [Column("ABNUM")]
        public int? Abnum { get; set; }

        [Column("NPLDA")]
        public DateTime? Nplda { get; set; }

        [Column("ADDAT")]
        public DateTime? Addat { get; set; }

        [Column("QMNUM")]
        [MaxLength(12)]
        public string? Qmnum { get; set; }

        [Column("OBKNR")]
        public int? Obknr { get; set; }

        [Column("GEWRK")]
        [MaxLength(8)]
        public string? Gewrk { get; set; }

        [Column("EQART_SUB")]
        [MaxLength(10)]
        public string? EqartSub { get; set; }

        [Column("OBJNR")]
        [MaxLength(22)]
        public string? Objnr { get; set; }

        [Column("AUFPL")]
        [MaxLength(10)]
        public string? Aufpl { get; set; }

        [Column("RSNUM")]
        [MaxLength(10)]
        public string? Rsnum { get; set; }

        [Column("ACC_FLG")]
        [MaxLength(1)]
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
        [MaxLength(4)]
        public string? Bukrs { get; set; }

        [Column("ARBPL")]
        [MaxLength(8)]
        public string? Arbpl { get; set; }

        [Column("WERKS")]
        [MaxLength(4)]
        public string? Werks { get; set; }

        [Column("KOSTV")]
        [MaxLength(10)]
        public string? Kostv { get; set; }

        [Column("STORT")]
        [MaxLength(10)]
        public string? Stort { get; set; }

        [Column("IPHAS")]
        [MaxLength(1)]
        public string? Iphas { get; set; }

        [Column("PHAS0")]
        [MaxLength(1)]
        public string? Phas0 { get; set; }

        [Column("PHAS1")]
        [MaxLength(1)]
        public string? Phas1 { get; set; }

        [Column("PHAS2")]
        [MaxLength(1)]
        public string? Phas2 { get; set; }

        [Column("PHAS3")]
        [MaxLength(1)]
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
        [MaxLength(2)]
        public string? HtBtbd { get; set; }

        [Column("STAFF_PL")]
        [MaxLength(10)]
        public string? StaffPl { get; set; }

        [Column("STAFF")]
        [MaxLength(10)]
        public string? Staff { get; set; }

        [Column("LOAIVT_SD")]
        [MaxLength(2)]
        public string? LoaivtSd { get; set; }

        [Column("STAFF_SC")]
        [MaxLength(10)]
        public string? StaffSc { get; set; }

        [Column("STAFF_KT")]
        [MaxLength(10)]
        public string? StaffKt { get; set; }

        [Column("AUSVN")]
        public DateTime? Ausvn { get; set; }

        [Column("AUSBS")]
        public DateTime? Ausbs { get; set; }

        [Column("LOCK_FLG")]
        [MaxLength(1)]
        public string? LockFlg { get; set; }

        [Column("LOCK_DATE")]
        public DateTime? LockDate { get; set; }

        [Column("DEL_FLG")]
        [MaxLength(1)]
        public string? DelFlg { get; set; }

        [Column("DEL_DATE")]
        public DateTime? DelDate { get; set; }

        [Column("STATUS")]
        [MaxLength(2)]
        public string? Status { get; set; }

        [Column("STAT")]
        [MaxLength(5)]
        public string? Stat { get; set; }

        [Column("STAT_T")]
        [MaxLength(4)]
        public string? StatT { get; set; }

        [Column("LIFNR")]
        [MaxLength(10)]
        public string? Lifnr { get; set; }

        [Column("BUDAT")]
        public DateTime? Budat { get; set; }

        [Column("BLDAT")]
        public DateTime? Bldat { get; set; }

        [Column("HKONT")]
        [MaxLength(10)]
        public string? Hkont { get; set; }

        [Column("DMBTR")]
        public decimal? Dmbtr { get; set; }

        [Column("WAERS")]
        [MaxLength(5)]
        public string? Waers { get; set; }

        [Column("ROOT_F")]
        [MaxLength(2)]
        public string? RootF { get; set; }

        [Column("STAT_MO")]
        [MaxLength(2)]
        public string? StatMo { get; set; }

        [Column("STAT_TD")]
        [MaxLength(2)]
        public string? StatTd { get; set; }

        [Column("STAT_KT")]
        [MaxLength(2)]
        public string? StatKt { get; set; }

        [Column("CF_FLG")]
        [MaxLength(1)]
        public string? CfFlg { get; set; }

        [Column("KQ_FLG")]
        [MaxLength(1)]
        public string? KqFlg { get; set; }

        [Column("GROUPID_PM")]
        [MaxLength(10)]
        public string? GroupIdPm { get; set; }

        [Column("PMVTID")]
        [MaxLength(10)]
        public string? Pmvtid { get; set; }

        [Column("ERNAM")]
        [MaxLength(12)]
        public string? Ernam { get; set; }

        [Column("ERDAT")]
        public DateTime? Erdat { get; set; }

        [Column("AENAM")]
        [MaxLength(12)]
        public string? Aenam { get; set; }

        [Column("AEDAT")]
        public DateTime? Aedat { get; set; }

        [Column("NEEDUP")]
        [MaxLength(1)]
        public string? Needup { get; set; }

        [Column("BELNR")]
        [MaxLength(10)]
        public string? Belnr { get; set; }

        [Column("GJAHR")]
        [MaxLength(4)]
        public string? Gjahr { get; set; }

    }
}
