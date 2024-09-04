{
  "basket":{
    "byUser"   : "select a.id_product, a.code, coalesce(p.product_name, m.product_name) as product_name, coalesce(c.name,'') customer_name, coalesce(a.id_customer,0) as id_customer, cast(a.qty as integer) as iqty, a.satuan from bi.tb_basket a left outer join tb_m_people c on c.id_people = a.id_customer left outer join tb_product p on p.id_product = a.id_product and a.satuan = 'MC' left outer join tb_m_mco m on m.id_mco = a.id_product and a.satuan = 'PAC' where a.userid = $1 and a.id_product<>0 order by field_id",
    "addBasket": "select bi.add_basket(${par.userid}, ${par.id_product}, ${par.qty}, ${par.code}, ${par.satuan}, ${par.id_customer});",
    "delBasket": "delete from bi.tb_basket where userid = ${par.userid} and id_product = ${par.id_product} RETURNING 'Deleted' as status;",
    "setQty"   : "update bi.tb_basket set qty = ${par.qty} where userid = ${par.userid} and id_product = ${par.id_product} RETURNING 'Updated' as status;",
    "setCustomer": "update bi.tb_basket set id_customer = ${par.id_customer} where userid = ${par.userid} RETURNING id_customer;"    
  },
  "order":{
    "genQuotation"   : "select bi.gen_quotation(${par.userid}, ${par.shipdate}::date, ${par.notex});",
    "quotationbydate": "select to_char(tgl, 'DD') tg, to_char(tgl, 'MON') bln, * from ( select distinct userid, nomor, tgl, shipment_dt, istatus, (select name from tb_m_people where id_people=a.id_customer) customer from bi.tb_quotation a where userid in (select public.getslssubor_unm(${par.userid})) and tgl between ${par.start_dt}::date and (${par.end_dt}::date||' 23:59:59')::timestamp ) b where cast(lower(customer) as varchar) like ${par.customer} order by nomor desc",
    "quotationdetail": "select nomor, tgl, shipment_dt, istatus, (select name from tb_m_people where id_people=a.id_customer) customer, coalesce(p.product_name, m.product_name) as product_name, qty, case when matype=1 then 'MC' else 'PAC' end satuan, notes from bi.tb_quotation a left outer join tb_product p on p.id_product = a.id_product and a.matype = 1 left outer join tb_m_mco m on m.id_mco = a.id_product and a.matype = 2 where a.nomor=${par.nomor} order by field_id",
    "setquotationstat": "update bi.tb_quotation set istatus = -1 where nomor = ${par.nomor} RETURNING nomor;",
    "stockByLoc"     : "select * from bi.gen_stockbyid(${par.matype}, ${par.idproduct})",
    "copyQuotation"  : "select bi.copy_quotation(${par.userid}, ${par.nomor});",
    "quotationbyproduct": "select product_name, qty, satuan, max(mc) over() mc, max(pac) over() pac from (select a.*,COALESCE(sum(qty) filter (where satuan = 'MC')over(partition by satuan),0)::int mc, COALESCE(sum(qty) filter (where satuan = 'PAC')over(partition by satuan),0)::int pac from (select coalesce(p.product_name, m.product_name) as product_name, sum(qty)::int as qty, case when matype=1 then 'MC' else 'PAC' end satuan from bi.tb_quotation a left outer join tb_product p on p.id_product = a.id_product and a.matype = 1 left outer join tb_m_mco m on m.id_mco = a.id_product and a.matype = 2 where istatus='1' and tgl between ${par.start_dt}::date and (${par.end_dt}::date||' 23:59:59')::timestamp and upper(a.userid) in (select getslssubor_unm(${par.userid})) group by a.matype, a.id_product, p.product_name, m.product_name) a) b order by 1"
  },
  "delivery":{
    "getListDO": "select to_char(sj_date, 'DD') tg, to_char(sj_date, 'MON') bln, x.* from ( select a.sj_date, d.do_no, a.sj_id, a.sj_no, b.sjmd_no, c.name, replace(upper(d.driver_nm), 'PAK ','') sopir, d.do_info from public.tb_ls_suratjalan_m as a left outer join public.tb_ls_suratjalan_md as b on a.sj_id = b.sj_id left outer join public.tb_m_people as c on b.id_people = c.id_people left outer join public.tb_delvorder_m as d on a.do_id = d.do_id where sj_date between ${par.start_dt}::date and (${par.end_dt}::date||' 23:59:59')::timestamp ) x where cast(sjmd_no||' '||name||' '||sopir||' '||do_info as varchar) ilike ${par.customer} order by sj_date desc, sjmd_no asc",
    "getDetailDO": "select sj_id, sj_seq, id_product, (sj_qty+sj_qtypck) qty, case when pack_type=0 then 'MC' else 'PAC' end as satuan, (select product_cd from bi.get_productbyid(id_product,case when pack_type=0 then 1 else 2 end)) code, (select product_nm from bi.get_productbyid(id_product,case when pack_type=0 then 1 else 2 end)) product_nm from tb_ls_suratjalan_d where sj_id = (select sj_id from tb_ls_suratjalan_md where sjmd_no=${par.nomor}) order by sj_seq",
    "getPhoto": "select field_id as baris, image from tb_photo a where modul = ${par.modul} and sid = ${par.number} union all select 0 as baris, image from tb_photo a where modul = 'IMGBLANK' order by 1 desc",
    "addPhoto": "insert into tb_photo(modul, sid, image, userid) values (${par.modul}, ${par.number}, ${par.photo}, ${par.uid});",
    "delPhoto": "delete from tb_photo where field_id = ${par.fid};",
    "setDelivered" : "insert into tb_logs(tgl, modul, notes, ivalue, userid) values (current_timestamp, 'DO_DOC', ${par.notes}, 1, ${par.userid}) RETURNING ${par.notes} as nomor;",
    "dofStatus" : "select coalesce(ivalue,0) status from tb_logs where modul='DO_DOC' and notes= $1 order by tgl desc limit 1"
  },
  "visit": {
    "getListVisit_old": "select to_char(tanggal, 'yyyy-mm-dd HH24:MI:SS') tgl, photo, userid, status from tb_sales_visit where status in ('CHECK IN','CHECK OUT') and tanggal between ${par.start_dt}::date and (${par.end_dt}::date||' 23:59:59')::timestamp order by tanggal desc",
    "getListVisit": "select nomor, userid, to_char(min(tanggal), 'yyyy-mm-dd') tgl, max(case when status = 'CHECK IN' then to_char(tanggal, 'yyyy-mm-dd HH24:MI:SS') else '-' end) checkin, max(case when status = 'CHECK OUT' then to_char(tanggal, 'yyyy-mm-dd HH24:MI:SS') else '-' end) checkout, to_char(max(tanggal) - min(tanggal), 'HH24:MI:SS') durasi, coalesce((select name from tb_m_people where id_people = (select id_customer from tb_visit_plan where nomor = a.nomor)), '-') custname from tb_sales_visit a where status in ('CHECK IN','CHECK OUT') and tanggal between ${par.start_dt}::date and (${par.end_dt}::date||' 23:59:59')::timestamp group by nomor, userid order by nomor desc",
    "visitStatus" : "select visit_status(${par.userid}, ${par.nomor}) as stat;",
    "checkinout": "select addvisit(${par.userid}, ${par.photo}, ${par.lat}, ${par.long}, ${par.address}, ${par.notes}, ${par.status}, ${par.nomor});",
    "getVisitPlan": "select nomor, salesid, tanggal, id_customer from tb_visit_plan where to_char(tanggal,'yyyymm') = ${par.periode} order by tanggal",
    "addVisitPlan": "select gen_visitplan(${par.salesid}, ${par.tanggal}, ${par.id_customer}, ${par.created_by}) as nomor",
    "visitDetail":"select coalesce(inpic,'-') inpic, coalesce(outpic,'-') outpic, coalesce(notes,'-') notes from (select (select photo from tb_sales_visit where status = 'CHECK IN' and nomor = ${par.nomor}) inpic, (select photo outpic from tb_sales_visit where status = 'CHECK OUT' and nomor = ${par.nomor}), (select notes from tb_sales_visit where status = 'CHECK OUT' and nomor = ${par.nomor})) a"
  },
  "attendance": {
    "getAttendance": "select trim(left(to_char(a.tgl, 'DAY'),3)) hari, to_char(a.tgl, 'DD') tg, to_char(a.tgl, 'Mon') bln, coalesce(to_char(time_in, 'HH24:MI'),'') masuk, coalesce(to_char(time_out, 'HH24:MI'),'') pulang, '' status from (select * from generate_series(cast(${par.start_dt} as date), cast(${par.end_dt} as date), '1 day') as tgl) a left outer join (select tgl, time_in, time_out, status from bi.tb_attendance where id_sales = ${par.idpeople} and tgl between ${par.start_dt} and ${par.end_dt} ) b on cast(b.tgl as date)=cast(a.tgl as date) order by a.tgl desc", 
    "attStatus" : "select bi.att_status(${par.idpeople}) as stat;",
    "addAbsensi": "select bi.add_absensi(${par.idpeople}, ${par.userid}, ${par.photo}, ${par.lat}, ${par.long}) as stat;"
  }
}
