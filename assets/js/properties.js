h265_properties = {
	format : {
		no_able : [
			'allow-non-conformance',
			'amp',
			'analyze-src-pics',
			// 'annexb', rather added as a special case, because of problems with handbrake
			'aq-motion',
			'aud',
			'b-intra',
			'b-pyramid',
			'constrained-intra',
			'cu-lossless',
			'cutree',
			//'dhdr10-opt', Default isn't known
			'early-skip',
			'fast-intra',
			'hdr',
			'hdr-opt',
			'high-tier',
			'hrd',
			'hdr-opt',
			'info',
			'limit-modes',
			'limit-sao',
			'lossless',
			'multi-pass-opt-analysis',
			'multi-pass-opt-distortion',
			'multi-pass-opt-rps',
			'open-gop',
			'opt-cu-delta-qp',
			'opt-qp-pps',
			'opt-ref-list-length-pps',
			'pme',
			'pmode',
			'psnr',
			'rc-grain',
			'rd-refine',
			'rect',
			'repeat-headers',
			'rskip',
			'recursion-skip',
			'sao',
			'sao-non-deblock',
			'signhide',
			'slow-firstpass',
			'ssim',
			'ssim-rd',
			'strict-cbr',
			'intra-refresh',
			'strong-intra-smoothing',
			'temporal-layers',
			'temporal-mvp',
			'tskip',
			'tskip-fast',
			'vui-hrd-info',
			'vui-timing-info',
			'weightb',
			'weightp',
			'wpp'
		],
		str_num : [
			'analysis-mode',
			'colormatrix',
			'colorprim',
			'log-level',
			'transfer',
			'videoformat'
		],
		strange : [
			'annexb',
			'asm',
			'deblock',
			'dither',
			'hash',
			'interlace',
			'max-cll',
			'numa-pools',
			'overscan',
			'pass',
			'profile',
			'range',
			'rc',
			'scenecut',
			'scenecut-bias',
			'uhd-bd',
			'zone-count',
			'zones',
			'dhdr10-opt',
			'sar',
			'display-window',
			'chromaloc'
		]
	}
};