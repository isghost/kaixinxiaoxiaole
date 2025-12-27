System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, gfx, _crd, SampleCount;

  function makeMSAA() {
    return {
      enabled: false,
      sampleCount: SampleCount.X4
    };
  }

  function fillRequiredMSAA(value) {
    if (value.enabled === undefined) {
      value.enabled = false;
    }

    if (value.sampleCount === undefined) {
      value.sampleCount = SampleCount.X4;
    }
  }

  function makeHBAO() {
    return {
      enabled: false,
      radiusScale: 1,
      angleBiasDegree: 10,
      blurSharpness: 3,
      aoSaturation: 1,
      needBlur: false
    };
  }

  function fillRequiredHBAO(value) {
    if (value.enabled === undefined) {
      value.enabled = false;
    }

    if (value.radiusScale === undefined) {
      value.radiusScale = 1;
    }

    if (value.angleBiasDegree === undefined) {
      value.angleBiasDegree = 10;
    }

    if (value.blurSharpness === undefined) {
      value.blurSharpness = 3;
    }

    if (value.aoSaturation === undefined) {
      value.aoSaturation = 1;
    }

    if (value.needBlur === undefined) {
      value.needBlur = false;
    }
  }

  function makeBloom() {
    return {
      enabled: false,
      material: null,
      enableAlphaMask: false,
      iterations: 3,
      threshold: 0.8,
      intensity: 2.3
    };
  }

  function fillRequiredBloom(value) {
    if (value.enabled === undefined) {
      value.enabled = false;
    }

    if (value.material === undefined) {
      value.material = null;
    }

    if (value.enableAlphaMask === undefined) {
      value.enableAlphaMask = false;
    }

    if (value.iterations === undefined) {
      value.iterations = 3;
    }

    if (value.threshold === undefined) {
      value.threshold = 0.8;
    }

    if (value.intensity === undefined) {
      value.intensity = 2.3;
    }
  }

  function makeColorGrading() {
    return {
      enabled: false,
      material: null,
      contribute: 1,
      colorGradingMap: null
    };
  }

  function fillRequiredColorGrading(value) {
    if (value.enabled === undefined) {
      value.enabled = false;
    }

    if (value.material === undefined) {
      value.material = null;
    }

    if (value.contribute === undefined) {
      value.contribute = 1;
    }

    if (value.colorGradingMap === undefined) {
      value.colorGradingMap = null;
    }
  }

  function makeFSR() {
    return {
      enabled: false,
      material: null,
      sharpness: 0.8
    };
  }

  function fillRequiredFSR(value) {
    if (value.enabled === undefined) {
      value.enabled = false;
    }

    if (value.material === undefined) {
      value.material = null;
    }

    if (value.sharpness === undefined) {
      value.sharpness = 0.8;
    }
  }

  function makeFXAA() {
    return {
      enabled: false,
      material: null
    };
  }

  function fillRequiredFXAA(value) {
    if (value.enabled === undefined) {
      value.enabled = false;
    }

    if (value.material === undefined) {
      value.material = null;
    }
  }

  function makeToneMapping() {
    return {
      material: null
    };
  }

  function fillRequiredToneMapping(value) {
    if (value.material === undefined) {
      value.material = null;
    }
  }

  function makePipelineSettings() {
    return {
      msaa: makeMSAA(),
      enableShadingScale: false,
      shadingScale: 0.5,
      bloom: makeBloom(),
      toneMapping: makeToneMapping(),
      colorGrading: makeColorGrading(),
      fsr: makeFSR(),
      fxaa: makeFXAA()
    };
  }

  function fillRequiredPipelineSettings(value) {
    if (!value.msaa) {
      value.msaa = makeMSAA();
    } else {
      fillRequiredMSAA(value.msaa);
    }

    if (value.enableShadingScale === undefined) {
      value.enableShadingScale = false;
    }

    if (value.shadingScale === undefined) {
      value.shadingScale = 0.5;
    }

    if (!value.bloom) {
      value.bloom = makeBloom();
    } else {
      fillRequiredBloom(value.bloom);
    }

    if (!value.toneMapping) {
      value.toneMapping = makeToneMapping();
    } else {
      fillRequiredToneMapping(value.toneMapping);
    }

    if (!value.colorGrading) {
      value.colorGrading = makeColorGrading();
    } else {
      fillRequiredColorGrading(value.colorGrading);
    }

    if (!value.fsr) {
      value.fsr = makeFSR();
    } else {
      fillRequiredFSR(value.fsr);
    }

    if (!value.fxaa) {
      value.fxaa = makeFXAA();
    } else {
      fillRequiredFXAA(value.fxaa);
    }
  }

  _export({
    makeMSAA: makeMSAA,
    fillRequiredMSAA: fillRequiredMSAA,
    makeHBAO: makeHBAO,
    fillRequiredHBAO: fillRequiredHBAO,
    makeBloom: makeBloom,
    fillRequiredBloom: fillRequiredBloom,
    makeColorGrading: makeColorGrading,
    fillRequiredColorGrading: fillRequiredColorGrading,
    makeFSR: makeFSR,
    fillRequiredFSR: fillRequiredFSR,
    makeFXAA: makeFXAA,
    fillRequiredFXAA: fillRequiredFXAA,
    makeToneMapping: makeToneMapping,
    fillRequiredToneMapping: fillRequiredToneMapping,
    makePipelineSettings: makePipelineSettings,
    fillRequiredPipelineSettings: fillRequiredPipelineSettings
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      gfx = _cc.gfx;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "cbf30kCUX9A3K+QpVC6wnzx", "builtin-pipeline-types", undefined);
      /*
       Copyright (c) 2021-2024 Xiamen Yaji Software Co., Ltd.
      
       https://www.cocos.com
      
       Permission is hereby granted, free of charge, to any person obtaining a copy
       of this software and associated documentation files (the "Software"), to deal
       in the Software without restriction, including without limitation the rights to
       use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
       of the Software, and to permit persons to whom the Software is furnished to do so,
       subject to the following conditions:
      
       The above copyright notice and this permission notice shall be included in
       all copies or substantial portions of the Software.
      
       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
       IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
       FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
       AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
       LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
       OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
       THE SOFTWARE.
      */

      /**
       * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
       * The following section is auto-generated.
       * ========================= !DO NOT CHANGE THE FOLLOWING SECTION MANUALLY! =========================
       */

      /* eslint-disable max-len */


      __checkObsolete__(['Material', 'Texture2D', 'gfx']);

      ({
        SampleCount
      } = gfx);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=383c24386be9d9de15fc0c17a8951753b54d596a.js.map