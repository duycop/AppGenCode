USE [master]
GO
/****** Object:  Database [QLDien]    Script Date: 2024-10-18 21:54:47 ******/
CREATE DATABASE [QLDien]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'QLDien', FILENAME = N'd:\QLDien.mdf' , SIZE = 532480KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'QLDien_log', FILENAME = N'd:\QLDien_log.ldf' , SIZE = 20652032KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [QLDien] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [QLDien].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [QLDien] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [QLDien] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [QLDien] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [QLDien] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [QLDien] SET ARITHABORT OFF 
GO
ALTER DATABASE [QLDien] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [QLDien] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [QLDien] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [QLDien] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [QLDien] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [QLDien] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [QLDien] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [QLDien] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [QLDien] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [QLDien] SET  DISABLE_BROKER 
GO
ALTER DATABASE [QLDien] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [QLDien] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [QLDien] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [QLDien] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [QLDien] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [QLDien] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [QLDien] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [QLDien] SET RECOVERY FULL 
GO
ALTER DATABASE [QLDien] SET  MULTI_USER 
GO
ALTER DATABASE [QLDien] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [QLDien] SET DB_CHAINING OFF 
GO
ALTER DATABASE [QLDien] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [QLDien] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [QLDien] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [QLDien] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [QLDien] SET QUERY_STORE = ON
GO
ALTER DATABASE [QLDien] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [QLDien]
GO
/****** Object:  UserDefinedFunction [dbo].[FN_DateSplit]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Do Duy Cop
-- Create date: 25.11.2021
-- Description: group datetime inteval by minute
-- =============================================
CREATE FUNCTION [dbo].[FN_DateSplit]
(
	@t Datetime,
	@n int
)
RETURNS datetime
AS
BEGIN
	if (@n=0) return @t;

	declare @year int,@month int,@day int,@HH int,@MM int;

	select @year=DATEPART(YEAR, @t),@month=DATEPART(MONTH, @t),@day=DATEPART(DAY,@t),@HH=DATEPART(HOUR,@t),@MM=DATEPART(MINUTE,@t);

	set @MM = (@MM/@n) * @n;
	if(@MM >= 60) set @MM = 59;
	if(@MM <= 0) set @MM = 0;
	return CONVERT(datetime,
	cast(@year as varchar)+'-'+
	cast(@month as varchar)+'-'+
	cast(@day as varchar)+' '+
	cast(@HH as varchar)+':'+
	cast(@MM as varchar)
	,120)
END
GO
/****** Object:  UserDefinedFunction [dbo].[fn_DateTime2Str]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		do duy cop
-- Create date: 21h18 01/01/2022
-- Description:	time format
-- -- 2022-12-30 12:34:56
--    12345678901234567890
-- =============================================
CREATE FUNCTION [dbo].[fn_DateTime2Str]
(
	@time datetime
)
RETURNS varchar(20)
AS
BEGIN	
	DECLARE @kq varchar(20);
	if(@time is null)
		select @kq='';
	else
		select @kq=convert(varchar,@time,120);
	return @kq;
END
GO
/****** Object:  UserDefinedFunction [dbo].[SP_OrderBy]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		do duy cop
-- Create date: 11.10.2024
-- Description:	order by sensor
-- =============================================
CREATE FUNCTION [dbo].[SP_OrderBy]
(
	@loai nvarchar(50)
	
)
RETURNS int
AS
BEGIN
	
	DECLARE @kq int=10;
	if(@loai='input')set @kq=1;
	else if(@loai='output')set @kq=2;
	else if(@loai='selec')set @kq=3;
	else if(@loai='khac')set @kq=4;

	RETURN @kq;

END
GO
/****** Object:  Table [dbo].[Cookie]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Cookie](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[uid] [nvarchar](50) NULL,
	[cookie] [nvarchar](50) NULL,
	[time] [datetime] NULL,
 CONSTRAINT [PK_Cookie] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[History]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[History](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sid] [int] NULL,
	[value] [float] NULL,
	[time] [datetime] NULL,
	[time_end] [datetime] NULL,
 CONSTRAINT [PK_DataE] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Log]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[key] [nvarchar](50) NULL,
	[msg] [nvarchar](max) NULL,
	[time] [datetime] NULL,
 CONSTRAINT [PK_Log] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Sensor]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sensor](
	[sid] [int] NOT NULL,
	[tram] [int] NULL,
	[delta] [float] NULL,
	[value] [float] NULL,
	[unit] [nvarchar](10) NULL,
	[time] [datetime] NULL,
	[name] [nvarchar](50) NULL,
	[min] [float] NULL,
	[max] [float] NULL,
	[loai] [nvarchar](50) NULL,
	[gain] [float] NULL,
	[offset] [float] NULL,
	[display] [bit] NULL,
	[lastChange] [datetime] NULL,
	[tag] [nvarchar](50) NULL,
 CONSTRAINT [PK_Sensor] PRIMARY KEY CLUSTERED 
(
	[sid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Setting]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Setting](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](50) NOT NULL,
	[type] [nvarchar](50) NULL,
	[value] [nvarchar](max) NULL,
	[time] [datetime] NULL,
	[enable] [bit] NULL,
 CONSTRAINT [PK_setting] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sv]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sv](
	[masv] [int] NOT NULL,
	[hoten] [nvarchar](50) NULL,
	[qq] [nvarchar](50) NULL,
	[tien] [float] NULL,
 CONSTRAINT [PK_sv] PRIMARY KEY CLUSTERED 
(
	[masv] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TuDien]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TuDien](
	[id] [int] NOT NULL,
	[name] [nvarchar](255) NULL,
	[kihieu] [nvarchar](50) NULL,
	[stt] [int] NULL,
 CONSTRAINT [PK_TuDien] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[uid] [varchar](50) NOT NULL,
	[pwd] [varbinary](20) NULL,
	[name] [nvarchar](50) NULL,
	[role] [int] NULL,
	[lastLogin] [datetime] NULL,
 CONSTRAINT [PK_User] PRIMARY KEY CLUSTERED 
(
	[uid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[UserRole]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[UserRole](
	[id] [int] NOT NULL,
	[roleName] [nvarchar](50) NULL,
	[Note] [nvarchar](50) NULL,
 CONSTRAINT [PK_UserRole] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Cookie] ON 
GO
INSERT [dbo].[Cookie] ([id], [uid], [cookie], [time]) VALUES (2, N'admin', N'rccw34dznzn9k2w89mhfdbzyxlwkyc4t', CAST(N'2024-10-18T15:38:08.517' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Cookie] OFF
GO
SET IDENTITY_INSERT [dbo].[Log] ON 
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (1, N'Login OK', N'admin: System Admin, Last Login: 2024-10-18 14:01:18', CAST(N'2024-10-18T14:20:37.703' AS DateTime))
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (2, N'Logout', N'admin thoát!', CAST(N'2024-10-18T15:37:37.177' AS DateTime))
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (3, N'Login error password', N'admin: Nhập password sai rồi!', CAST(N'2024-10-18T15:37:46.073' AS DateTime))
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (4, N'Login error password', N'admin: Nhập password sai rồi!', CAST(N'2024-10-18T15:37:49.970' AS DateTime))
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (5, N'Login error password', N'admin: Nhập password sai rồi!', CAST(N'2024-10-18T15:37:54.930' AS DateTime))
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (6, N'Login OK', N'admin: System Admin, Last Login: 2024-10-18 15:37:29', CAST(N'2024-10-18T15:38:08.517' AS DateTime))
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (7, N'sv_update', N'{"ok":1,"msg":"sv_update ok"}', CAST(N'2024-10-18T21:24:58.940' AS DateTime))
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (8, N'sv_update', N'[{"ok":1,"msg":"sv_update ok","hoten":"Lê Năm","qq":"Gia Lai","tien":7.000000000000000e+000}]', CAST(N'2024-10-18T21:30:22.030' AS DateTime))
GO
INSERT [dbo].[Log] ([id], [key], [msg], [time]) VALUES (9, N'sv_update', N'[{"ok":1,"msg":"sv_update ok","hoten":"Lê Năm","qq":"Gia Lai","tien":7.000000000000000e+000}]', CAST(N'2024-10-18T21:30:27.200' AS DateTime))
GO
SET IDENTITY_INSERT [dbo].[Log] OFF
GO
INSERT [dbo].[sv] ([masv], [hoten], [qq], [tien]) VALUES (1, N'Nguyễn Văn Nhất', N'Thái Nguyên', 1000130)
GO
INSERT [dbo].[sv] ([masv], [hoten], [qq], [tien]) VALUES (2, N'Trần Thị Hai', N'hà Nội', 345)
GO
INSERT [dbo].[sv] ([masv], [hoten], [qq], [tien]) VALUES (3, N'Phạm Văn Ba', N'Thái Bình', 10500)
GO
INSERT [dbo].[sv] ([masv], [hoten], [qq], [tien]) VALUES (4, N'Đỗ Văn Tư', N'Thái Nguyên', 1000)
GO
INSERT [dbo].[sv] ([masv], [hoten], [qq], [tien]) VALUES (5, N'Lê Năm', N'Gia Lai', 7)
GO
INSERT [dbo].[sv] ([masv], [hoten], [qq], [tien]) VALUES (8, N'Lê Văn Năm', N'Cao Bằng', 888123)
GO
INSERT [dbo].[User] ([uid], [pwd], [name], [role], [lastLogin]) VALUES (N'admin', 0xCD5EA73CD58F827FA78EEF7197B8EE606C99B2E6, N'System Admin', 4, CAST(N'2024-10-18T21:24:51.803' AS DateTime))
GO
INSERT [dbo].[User] ([uid], [pwd], [name], [role], [lastLogin]) VALUES (N'duycop', 0x9EFBC773D2878ECF7DFFE0EC4F9455694EC910B2, N'Đỗ Duy Cốp', 3, NULL)
GO
INSERT [dbo].[User] ([uid], [pwd], [name], [role], [lastLogin]) VALUES (N'hien', 0x132FF221129D5D36FA094A0F1ACF3F7BA12B5290, N'Phan Thanh Hiền', 2, CAST(N'2024-10-17T07:09:45.187' AS DateTime))
GO
INSERT [dbo].[User] ([uid], [pwd], [name], [role], [lastLogin]) VALUES (N'khach', 0x6C4F7C891D66953126601AAB72930455B8C885DE, N'Khách xem ko đk đc', 1, CAST(N'2024-10-17T07:16:05.953' AS DateTime))
GO
INSERT [dbo].[UserRole] ([id], [roleName], [Note]) VALUES (1, N'Khách', N'Chỉ xem')
GO
INSERT [dbo].[UserRole] ([id], [roleName], [Note]) VALUES (2, N'Nhân viên', N'Xem và điều khiển')
GO
INSERT [dbo].[UserRole] ([id], [roleName], [Note]) VALUES (3, N'Quản lý', N'Thêm được user')
GO
INSERT [dbo].[UserRole] ([id], [roleName], [Note]) VALUES (4, N'Admin', N'Quản trị hệ thống')
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [unique_name_setting]    Script Date: 2024-10-18 21:54:47 ******/
CREATE UNIQUE NONCLUSTERED INDEX [unique_name_setting] ON [dbo].[Setting]
(
	[name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Log] ADD  CONSTRAINT [DF_Log_time]  DEFAULT (getdate()) FOR [time]
GO
ALTER TABLE [dbo].[Setting] ADD  CONSTRAINT [DF_setting_time]  DEFAULT (getdate()) FOR [time]
GO
ALTER TABLE [dbo].[Setting] ADD  CONSTRAINT [DF_setting_enable]  DEFAULT ((0)) FOR [enable]
GO
ALTER TABLE [dbo].[User]  WITH CHECK ADD  CONSTRAINT [FK_User_UserRole] FOREIGN KEY([role])
REFERENCES [dbo].[UserRole] ([id])
ON UPDATE CASCADE
GO
ALTER TABLE [dbo].[User] CHECK CONSTRAINT [FK_User_UserRole]
GO
/****** Object:  StoredProcedure [dbo].[SP_COOKIE]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Đỗ Duy Cốp
-- Create date: 23.09.2021
-- Description:	tạo cookie để auto login
-- =============================================
CREATE PROCEDURE [dbo].[SP_COOKIE] 
	@action nvarchar(50),
	@uid nvarchar(50)=null,
	@cookie nvarchar(50)=null,
	@ok bit = null output 
AS
BEGIN
	if(@action='INSERT')
	begin
		insert into [Cookie]([uid],[cookie],[time])values(@uid,@cookie,getdate());		
	end
	else if(@action='CHECK')
	begin		
		SELECT @OK=COUNT(*) FROM [Cookie] Where [uid]=@uid and [cookie]=@cookie and DATEDIFF(dd, [time], GETDATE()) <= 1;
		if(@ok=1)
		  begin
		    update [User] set [lastLogin]=getdate() where [uid]=@uid;
		  end
	end
	else if(@action='DELETE')
	begin
		delete from [Cookie] where [uid]=@uid and [cookie]=@cookie;
	end
	if(@action='DELETE_ALL')
	begin
		delete from [Cookie] where [uid]=@uid;
	end
	else if(@action='DELETE_AUTO')
	begin
		delete from [Cookie] where DATEDIFF(DAY, time, GETDATE()) > 30;
	end
END
GO
/****** Object:  StoredProcedure [dbo].[SP_LOG]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Do Duy Cop
-- Create date: 2024-09-29
-- Description:	SP_LOG dùng để lưu vết mọi thứ
-- =============================================
CREATE PROCEDURE [dbo].[SP_LOG]
	@action varchar(50),
	@key  nvarchar(max)=null,
	@msg  nvarchar(max)=null
AS
BEGIN
	SET NOCOUNT ON;
	declare @json nvarchar(max)='';
	if(@action='add_log')
	begin
		insert into [Log]([key],[msg])values(@key,@msg);
		select 1 as ok, N'add_log ok' as msg for json path, without_array_wrapper;
	end
	else if(@action='get_log')
	begin
		select @json=(
			select 1 as ok, N'get_log ok' as msg,
				(select top 100 [id],[key],[msg],convert(varchar(19), [time], 120) as [time] 
				from [Log] 
				where [key] not in('clear_all')
				order by [id] 
				desc for json path)as [data]
			for json path, without_array_wrapper
		);
		select @json as [json];
	end 
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Sensor]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		do duy cop
-- Create date: 08.10.2024
-- Description:	sensor type=selec : SID=tram*100+stt (0..31)
-- Description:	sensor type=input : SID=tram*100+stt (50..57)
-- Description:	sensor type=output: SID=tram*100+stt (70..77)
-- =============================================
CREATE PROCEDURE [dbo].[SP_Sensor]
	@action varchar(50)='get_sensor_history',
	@sid int=null,
	@value float=null,

	--dành cho lưu log điều khiển bit
	@tram int=null,
	@address int = null,
	@on_off bit = null,

	--dành cho get_sensor_history: @sid, @time_begin, @time_end
	@timeBegin datetime=null,
	@timeEnd   datetime=null,
	@n		int = 1,
	@num	int = 2,
	@offset int = 48
AS
BEGIN	
	declare @json nvarchar(max)='';	
	declare @json2 varchar(max)='';	
	declare @time datetime = getdate();
	declare @kihieu nvarchar(50);
	SET NOCOUNT ON;
	if(@action='clear_all')
	begin
		select @kihieu = [kihieu] from [TuDien] where [id]=@tram;
		insert into [Log]([key],[msg])values('clear_all',formatMessage(N'Tủ %s: Clear all bit. (id tủ = %d)',@kihieu,@tram));
		select FORMATMESSAGE('clear all DO of %s',@kihieu) as [json];
	end;
	else if(@action='control_bit')
	begin
		declare @name nvarchar(50);
		select @sid=[sid],@name=[name] from [Sensor] where [tram]=@tram and [offset]=@address;
		select @kihieu = [kihieu] from [TuDien] where [id]=@tram;
		update [Sensor] set [value]=@on_off,[time]=@time where [sid]=@sid;
		insert into [History]([sid],[value],[time],[time_end])values(@sid,@on_off,@time,DATEADD(SS,2,@time));
		if(@on_off=1)--bật
		begin
			insert into [Log]([key],[msg])values('turn_on',formatMessage(N'Tủ %s: %s (tủ %d turn on bit %d of sensor %d)',@kihieu,@name,@tram,@address,@sid));
			select FORMATMESSAGE('turn_on bit %d=%s of %s',@address,@name,@kihieu) as [json];
		end
		else if(@on_off=0) --tắt
		begin
			insert into [Log]([key],[msg])values('turn_off',formatMessage(N'Tủ %s: %s (tủ %d turn off bit %d of sensor %d)',@kihieu,@name,@tram,@address,@sid));
			select FORMATMESSAGE('turn_off bit %d=%s of %s',@address,@name,@kihieu) as [json];
		end		
	end;
	else if(@action='push_data')
	begin
		if(@sid is null or @value is null)return;
		if(not exists(select * from [Sensor] where [sid]=@sid)) return;

		declare @last_value float, @last_time datetime, @delta float, @diff int, @min float, @max float, @loai nvarchar(50), @tag nvarchar(50);
		select @last_value = isnull([value],-1), 
			   @last_time = isnull([time],'1970-01-01'),
			   @delta = [delta],
			   @min = [min],
			   @max = [max],
			   @diff = DATEDIFF(second,[time],@time),
			   @loai=[loai],
			   @tag =[tag]
		from [Sensor] 
		where [sid]=@sid;

		if(@loai in ('input','output'))
		begin
			set @value = cast(@value as int);
		end;

		if((ABS(@last_value - @value)>=@delta) or ((@diff>=54) AND (@loai not in ('input','output'))) )
		begin
			update [Sensor] set [value]=@value, [time]=@time,[lastChange]=@time where [sid]=@sid;
			insert into [History]([sid],[value],[time],[time_end])values(@sid,@value,@time,@time);
			select @json=(select cast(@sid as varchar)+' add_new' as msg for json path,without_array_wrapper);
		end;
		else
		begin
			declare @id int=null;
			select top 1 @id=[id] from [History] where [sid]=@sid and ([time]=@last_time or [time_end]=@last_time);
			if(@id is not null)
			begin
				update [Sensor] set [time]=@time where [sid]=@sid;
				update [History] set [time_end]=@time where [id]=@id;				
				select @json=(select cast(@sid as varchar)+ N' time_end' as msg for json path,without_array_wrapper);
			end;
			else
			  begin
				update [Sensor] set [time]=@time where [sid]=@sid;
				insert into [History]([sid],[value],[time],[time_end])values(@sid,@value,@time,@time);			  
				select @json=(select cast(@sid as varchar)+' add_new' as msg for json path,without_array_wrapper);
			  end;			
		end;
		select @json as [json];
	end;
	else if(@action='get_monitor')
	begin
		select @json=(
			select 1 as [ok],'monitor ok' as msg,
				(SELECT 
					[name],
					[value],
					convert(varchar(19), [time], 120) as [time],
					DATEDIFF(second,[time],@time) as [diff]
				 FROM [Setting]
				 where [type]='monitor'
				 for json path) as [data]
			for json path, without_array_wrapper
			);
		select @json=replace(@json,'"value":"[','"value":[');
		select @json=replace(@json,'","time":',',"time":');
		select @json as [json];
	end;
	else if(@action='get_sensor_full')
	begin
		select @json=(
			select 1 as [ok],'get_sensor_full ok' as msg,
			(select 
				[sid],
				[tram],
				[name],
				CAST([value] as DECIMAL(20, 2)) as 
				[value],
				[unit],
				--CAST([delta] as DECIMAL(20, 2)) as [delta],
				
				--convert(varchar(19), [time], 120) as [time],
				DATEDIFF(second,[time],@time) as [time],
				
				--CAST([min] as DECIMAL(20, 2)) as [min],
				--CAST([max] as DECIMAL(20, 2)) as [max],
				[loai],
				--CAST([gain] as DECIMAL(20, 2)) as [gain],
				CAST([offset] as DECIMAL(20, 2)) as [offset],
				[display],
				[tag]
			 from [Sensor]
			 order by [tram],dbo.SP_OrderBy(loai),[sid]
			 for json path
			)as [data],
			( select [id],[name],[kihieu]
			  from [tudien] 
			  order by [stt] 
			  for json path
			)as tu
			 for json path, without_array_wrapper
		);
		select @json as [json];
	end;
	else if(@action='get_sensor_quick')
	begin
		select @json2=(
			select 1 as [ok],'get_sensor_quick ok' as msg,
			(select 
				[sid] as [s],
				CAST([value] as DECIMAL(20, 2)) as [v],
				--[value] as [v],
				--convert(varchar(19), [time], 120) as [t],
				--convert(varchar(19), [lastChange], 120) as [c],
				DATEDIFF(second,[time],@time) as [dt],
				DATEDIFF(second,[lastChange],@time) as [dc]
			 from [Sensor]
			 order by [sid]
			 for json path
			)as [data]
			 for json path, without_array_wrapper
		);
		select @json2 as [json];
	end;
	else if(@action='get_sensor_quick2')
	begin
		select @json2=(
			select 
				1 as [ok],
				'get_sensor_quick2 ok' as msg,
				(
					select [name],json_query([value])as [value], DATEDIFF(second,[time],@time) as [dt]
					from [setting]
					where [type]='monitor' and isjson([value])=1
					order by left([name],2),right([name],2)
					for json path
				) as [data]
				for json path, without_array_wrapper
			);
		select @json2 as [json];
	end;
	else if(@action='get_sensor_history')
	begin
		if(@timeEnd is null)set @timeEnd=getdate();
		if(@timeBegin is null)set @timeBegin=DATEADD(HOUR,-8,@timeEnd);
		print @timeBegin;
		print @timeEnd;

		declare @table table([value] real,[time] datetime);
		if(exists(select * from [sensor] where [sid]=@sid and [loai] in('selec','khac') ))
		begin		
			insert into @table 
				select top 10080 
					--round(avg([value]),@num) as [value],
					--CAST(avg([value]) as DECIMAL(20, 2)) as [value],
					avg([value]) as [value],
					dbo.FN_DateSplit([time],@n) as [time] 
				from [History] 
				where([sid]=@sid)
					AND(([time]     >= @timeBegin AND [time]     <= @timeEnd) 
				     OR ([time_end] >= @timeBegin AND [time_end] <= @timeEnd)	
				     OR ([time]     <= @timeBegin AND [time_end] >= @timeEnd))
				group by dbo.FN_DateSplit([time],@n)
				order by 2;

			select @json=(
				select 
					1 as [ok],
					'get_sensor_history clock ok' as [msg],
					@sid as [sid],
					convert(varchar(19), @timeBegin, 120) as [t1],
					convert(varchar(19), @timeEnd, 120) as [t2],
					(	select 
							CAST([value] as DECIMAL(20, 2)) as [v],
							[time] as [t] 
						from @table 
						for json path
					)as [data]
				for json path,without_array_wrapper
			);
		end;
		else if(exists(select * from [sensor] where [sid]=@sid and [loai] in('input','output') ))
		begin
			select @json=(
			select 1 as [ok],'get_sensor_history i/o for timeline ok' as msg,@sid as [sid],
			(   
			SELECT
					cast([value] as int) as [v],
					convert(varchar,[time],120) as [tb],
					convert(varchar,[time_end],120) as [te]					
				FROM [History]
				WHERE ([sid]=@sid)
				  AND(([time]     >= @timeBegin AND [time]     <= @timeEnd) 
				   OR ([time_end] >= @timeBegin AND [time_end] <= @timeEnd)	
				   OR ([time]     <= @timeBegin AND [time_end] >= @timeEnd))
				ORDER BY [ID]
				for json path) as [data]
				for json path, without_array_wrapper
			);
		end;
		select @json as [json];
	end
END
GO
/****** Object:  StoredProcedure [dbo].[SP_Setting]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		do duy cop
-- Create date: 02.10.2024
-- Description:	SP_Setting
-- =============================================
CREATE PROCEDURE [dbo].[SP_Setting]
	@action varchar(50)='get_setting',
	@id int = null,
	@name   nvarchar(50)=null,
	@value  nvarchar(max)=null
AS
BEGIN
	declare @json nvarchar(max);
	SET NOCOUNT ON;
	
	if(@action='get_setting')
	begin
		select @json=(
			select 1 as ok, N'get_setting ok' as msg,
				(select top 100 [id],[name],[type],[value],convert(varchar(19), [time], 120) as [time] 
				 from [setting] 
				 where [enable]=1
				 order by [name] 
				 for json path)as [data]
			for json path, without_array_wrapper
		);
		select @json as [json];
	end;
	else if(@action='change_setting') -- gửi name và value
	begin
		select @value = REPLACE(@value,'"','\"')
		select @value = REPLACE(@value,char(13),'')
		select @value = REPLACE(@value,char(10),'')

		if(exists(select * from [Setting] where [name]=@name))
		begin
			update [Setting] set [value]=@value, [time]=getdate() where [name]=@name;
			select @json=(select 1 as ok, @name+N' ok' as msg for json path,without_array_wrapper);
		end;
		else
		begin
			insert into [Setting]([name],[value])values(@name,@value);
			select @json=(select 1 as ok, @name+N' add ok' as msg for json path,without_array_wrapper);
		end;
		select @json as [json];
	end;	
END
GO
/****** Object:  StoredProcedure [dbo].[SP_sv]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Auto gen by tool GenCode
--Author: Đỗ Duy Cốp
--Gen date: Friday, October 18, 2024 21:31:16
--TableName: sv
--primaryKey: masv
--field1	Mã sinh viên: masv => int
--field2	--Họ và tên: hoten => nvarchar(50)
--field3	--Quê Quán: qq => nvarchar(50)
--field4	Tiền Lương: tien => float

CREATE PROCEDURE [dbo].[SP_sv]
    @action NVARCHAR(50),
    @masv int = NULL,
    @hoten nvarchar(50) = NULL,
    @qq nvarchar(50) = NULL,
    @tien float = NULL,
    @TopN INT = NULL,
    @Page INT = NULL,
    @NumberPerPage INT = NULL,
    @q NVARCHAR(100) = NULL --search text
AS
BEGIN
    DECLARE @json nvarchar(max)='';  --  biến chứa json để trả về
    -- Thao tác get_all với bảng [sv]
    IF (@action = 'sv_get_all')
    BEGIN
      SELECT @json=(SELECT 1 AS [ok], 'sv_get_all ok' AS [msg],(
        SELECT [masv],[hoten],[qq],CAST([tien] as DECIMAL(20, 2)) as [tien]
        FROM [sv]
        ORDER BY [masv]
        FOR JSON PATH) AS data
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
      SELECT @json as [json];
    END
    -- Thao tác get_page với bảng [sv]
    IF (@action = 'sv_get_page')
    BEGIN
      SELECT @json=(SELECT 1 AS [ok], 'sv_get_page ok' AS [msg],(
        SELECT [masv],[hoten],[qq],CAST([tien] as DECIMAL(20, 2)) as [tien]
        FROM [sv]
        ORDER BY [masv]
        OFFSET (@Page - 1) * @NumberPerPage ROWS
        FETCH NEXT @NumberPerPage ROWS ONLY
        FOR JSON PATH) AS data
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
      SELECT @json as [json];
    END
    -- Thao tác get_top với bảng [sv]
    ELSE IF (@action = 'sv_get_top')
    BEGIN
      IF(@TopN IS NULL)SET @TopN=100;
      SELECT @json=(SELECT 1 AS [ok], 'sv_get_top ok' AS [msg],(
        SELECT TOP(@TopN) [masv],[hoten],[qq],CAST([tien] as DECIMAL(20, 2)) as [tien]
        FROM [sv]
        ORDER BY [masv]
        FOR JSON PATH) AS data
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
      SELECT @json as [json];
    END
    -- Thao tác search theo @q với bảng [sv]
    ELSE IF (@action = 'sv_search')
    BEGIN
      SET @q = '%'+@q+'%';
      SELECT @json=(SELECT 1 AS [ok], 'sv_search ok' AS [msg],(
        SELECT [masv],[hoten],[qq],CAST([tien] as DECIMAL(20, 2)) as [tien]
        FROM [sv]
        WHERE ([hoten] LIKE @q) AND ([qq] LIKE @q)
        ORDER BY [masv]
        FOR JSON PATH) AS data
      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
      SELECT @json as [json];
    END
    -- Thao tác insert với bảng [sv]
    ELSE IF (@action = 'sv_insert')
    BEGIN
      INSERT INTO [sv] (
          [masv],[hoten],[qq],[tien]
      ) VALUES (
          @masv,@hoten,@qq,@tien
      );
      SELECT @json=(SELECT 1 AS [ok],'sv_insert ok' as [msg],@hoten as [hoten],@qq as [qq],@tien as [tien] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
      SELECT @json as [json];
    END
    -- Thao tác update với bảng [sv]
    ELSE IF (@action = 'sv_update')
    BEGIN
      UPDATE [sv] SET
        [hoten]=@hoten,[qq]=@qq,[tien]=@tien
      WHERE [masv] = @masv;
      SELECT @json=(SELECT 1 AS [ok],'sv_update ok' as [msg],@hoten as [hoten],@qq as [qq],@tien as [tien] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
      SELECT @json as [json];
    END
    -- Thao tác delete với bảng [sv]
    ELSE IF (@action = 'sv_delete')
    BEGIN
      DELETE FROM [sv] WHERE [masv] = @masv;
      SELECT @json=(SELECT 1 AS [ok],'sv_delete ok' as [msg],@masv as [masv] FOR JSON PATH, WITHOUT_ARRAY_WRAPPER);
      SELECT @json as [json];
    END
END;
-- Kết thúc SP_sv
GO
/****** Object:  StoredProcedure [dbo].[SP_Telegram]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Do Duy COp
-- Create date: 9.10.2024
-- Description:	sp phuc vu telegram bot
-- =============================================
CREATE PROCEDURE [dbo].[SP_Telegram]
	@action varchar(50),
	@last_id_telegram int=null
AS
BEGIN
	if(@action='get_msg')
	begin
		select @last_id_telegram=cast(value as int)  
		from setting 
		where name='last_id_telegram';

		select top 1 id,msg,time
		from log 
		where ([key]='turn_on') and (id>@last_id_telegram);
	end
	else if(@action='set_last_msg')
	begin
	 update setting set value=cast( @last_id_telegram as varchar) 
	 where name='last_id_telegram';
	end
END
GO
/****** Object:  StoredProcedure [dbo].[SP_User]    Script Date: 2024-10-18 21:54:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Do Duy Cop
-- Create date: 28.09.2024
-- Description:	xử lý user
-- =============================================
CREATE PROCEDURE [dbo].[SP_User]
	@action varchar(50)=null,
	@uid	varchar(50)=null,
	@pwd	varbinary(20)=null,
	@name   Nvarchar(50)=null,
	@role   int=null
AS
BEGIN
	SET NOCOUNT ON;
	declare @json nvarchar(max), @time datetime = getdate();
	if(@action='get_user')
	begin		
		if exists(select * from [user] where [uid] = @uid) --nếu tồn tại user trùng uid và pwd
		begin
			SET NOCOUNT ON;
			select @json = (
				select 
					1 as [ok],
					N'get_user ok' as [msg], 
					[user].[uid], 
					[user].[name], 
					[user].[role], 
					[userRole].[roleName], 
					convert(varchar(19), [lastLogin], 120) as [lastLogin],
					DATEDIFF(second,[lastLogin],@time) as [diff]
				from [user] join [userRole] on [user].[role] = [userRole].[id]
				where uid = @uid
				for json path, without_array_wrapper
			);
			--cập nhật thời gian login lần này!
			update [user] set [lastLogin] = getdate() where [uid] = @uid
			select @json as [json];
		end;
		else
		begin
			select 0 as ok,N'Không tồn tại user này' as msg 
			for json path, without_array_wrapper;
		end;
	end;
	else if(@action='GetStoredPasswordHash')
	begin
		SELECT [pwd] FROM [user] WHERE [uid] = @uid;
	end;
	--else if(@action='login')
	--begin
	--	--trả về json={ok:1,msg:welcome,uid=uid,name=name,lastLogin=time} nếu login ok, ngược lại cũng trả về json: ok=0,msg=báo lỗi nào đó
	--	if exists(select * from [user] where ([uid] = @uid) and (pwd = HASHBYTES('SHA1',@pwd)) ) --nếu tồn tại user trùng uid và pwd
	--	begin
	--		SET NOCOUNT ON;
	--		select @json = (
	--			select 1 as ok,N'Login thành công' as [msg], [uid], [name], convert(varchar(19), [lastLogin], 120) as [lastLogin]
	--			from [user]
	--			where uid = @uid --and pwd= HASHBYTES ('SHA1',@pwd) --chỗ này ko cần phải HASH nữa
	--			for json path, without_array_wrapper
	--		);
	--		--cập nhật thời gian lần này.
	--		update [user] set lastLogin=getdate() where uid = @uid; --cập nhật now là lần login thành công cuối cùng
	--		select @json as [json];
	--	end;
	--	else
	--	begin
	--		select 0 as ok,N'Có gì đó sai sai' as msg 
	--		for json path, without_array_wrapper;
	--	end;
	--end;
	else if(@action='get_list_role')
	begin
		select 1 as ok,N'get_list_role ok' as [msg],
			(
			select [id],[roleName],[note]
			from [userRole]
			for json path
			) as [data]
		for json path, without_array_wrapper
	end;
	else if(@action='get_list_user')
	begin	
		select @json = (
			select 1 as ok,N'get_list_user ok' as [msg],
			(
			select 
				[user].[uid], 
				[user].[name], 
				[user].[role], 
				[userRole].[roleName], 
				convert(varchar(19), [lastLogin], 120) as [lastLogin],
				DATEDIFF(second,[lastLogin],@time) as [diff]
			from [user] join [userRole] on [user].[role] = [userRole].[id]
			for json path
			) as [data]
			for json path, without_array_wrapper
		);
		--cập nhật thời gian login lần này!
		update [user] set [lastLogin] = getdate() where [uid] = @uid
		select @json as [json];
	end;
	else if(@action='add_user')
	begin
		declare @role_add int;
		select @role_add = [role] from [user] where [uid]=@uid;
		if(@role_add>@role)
		begin
			raiserror(N'Không được thêm cấp cao hơn người thực hiện',16,1);
			return;
		end

		insert into [User]([uid],[pwd],[name],[role])values(@uid,@pwd,@name,@role);
		select 1 as ok, N'add_user ok' as msg for json path, without_array_wrapper;
	end
	else if(@action='edit_user')
	begin
		declare @role_edit int;
		select @role_edit = [role] from [user] where [uid]=@uid;
		if(@role_edit>@role)
		begin
			raiserror(N'Không được edit lên cấp cao hơn người thực hiện',16,1);
			return;
		end

		update [User] set [name]=@name,[role]=@role where [uid]=@uid;
		select 1 as ok, N'edit_user ok' as msg for json path, without_array_wrapper;
	end
	else if(@action='edit_pwd_user')
	begin
		update [User] set pwd=@pwd where [uid]=@uid;
		select 1 as ok, N'edit_pwd_user ok' as msg for json path, without_array_wrapper;
	end
	else if(@action='delete_user')
	begin
		declare @role_delete int;
		select @role_delete = [role] from [user] where [uid]=@uid;
		if(@role_delete>@role)
		begin
			raiserror(N'Không được xoá cấp cao hơn người thực hiện',16,1);
			return;
		end
		delete from [User] where [uid]=@uid and [role]<=@role;
		select 1 as ok, N'delete_user ok' as msg for json path, without_array_wrapper;
	end
END
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'SHA1 trả về 160bit = 20 byte' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'User', @level2type=N'COLUMN',@level2name=N'name'
GO
USE [master]
GO
ALTER DATABASE [QLDien] SET  READ_WRITE 
GO
