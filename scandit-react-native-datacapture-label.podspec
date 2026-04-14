require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
version = package["version"]


Pod::Spec.new do |s|
  s.name                    = package["name"]
  s.version                 = version
  s.summary                 = package["description"]
  s.homepage                = package["homepage"]
  s.license                 = package["license"]
  s.authors                 = { package["author"]["name"] => package["author"]["email"] }
  s.platforms               = { :ios => "15.0" }
  s.source                  = { :git => package["homepage"] + ".git", :tag => "#{s.version}" }
  s.swift_version           = '5.0'
  s.requires_arc            = true
  s.module_name             = "ScanditLabelCaptureCore"
  s.header_dir              = "ScanditLabelCaptureCore"

  s.dependency "scandit-react-native-datacapture-core", "= #{version}"
  s.dependency "scandit-react-native-datacapture-barcode", "= #{version}"
  s.dependency "scandit-datacapture-frameworks-label", '= 8.3.1'

  is_new_arch_enabled = ENV['RCT_NEW_ARCH_ENABLED'] == '1'

  if is_new_arch_enabled
    s.source_files          = "ios/Sources/**/*.{h,m,mm,swift}", "ios/generated/**/*.{h,m,mm,cpp}"
    s.private_header_files  = "ios/generated/**/*.h"
    s.exclude_files         = "ios/Sources/OldArch/**/*"
    s.dependency "React-RCTAppDelegate"

    s.pod_target_xcconfig = {
      'OTHER_SWIFT_FLAGS' => '-DRCT_NEW_ARCH_ENABLED',
      'HEADER_SEARCH_PATHS' => '"$(PODS_TARGET_SRCROOT)/ios/generated"'
    }
  else
    s.source_files          = "ios/Sources/**/*.{h,m,mm,swift}"
    s.exclude_files         = "ios/Sources/NewArch/**/*"
  end

  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"
  end
end
